const supabase = require("../config/supabase");

/**
 * Generic CRUD controller factory for simple Supabase tables.
 * table: string table name
 * options.orderBy: column to sort by on list (default 'sort_order')
 * options.singleton: if true, GET / always returns the single row (for 'profile' table)
 * options.searchFields: columns to search against
 * options.rangeQuery: support client-side range/pagination via ?range=0-49
 */
function crudFactory(table, options = {}) {
  const orderBy = options.orderBy || "sort_order";
  const singleton = !!options.singleton;
  const searchFields = options.searchFields || [];

  const controller = {
    // GET /api/<resource> — list with optional range, search
    list: async (req, res) => {
      try {
        let query = supabase.from(table).select("*", { count: "exact" });

        // Client-side range/pagination: ?range=0-49
        const range = req.query.range;
        if (range && !singleton) {
          const [start, end] = range.split("-").map(Number);
          if (!isNaN(start) && !isNaN(end)) {
            query = query.range(start, Math.min(end, start + 999));
          }
        }

        // ?visible=true filter (for navigation_items, social_links)
        if (req.query.visible !== undefined) {
          query = query.eq("visible", req.query.visible === "true");
        }

        // ?enabled=true filter (for site_sections)
        if (req.query.enabled !== undefined) {
          query = query.eq("enabled", req.query.enabled === "true");
        }

        // ?featured=true filter (for projects, research_papers, journal_articles)
        if (req.query.featured !== undefined) {
          query = query.eq("featured", req.query.featured === "true");
        }

        // ?category=X filter
        if (req.query.category) {
          query = query.eq("category", req.query.category);
        }

        // Text search via ?q=term (uses ilike on searchFields)
        const q = req.query.q;
        if (q && searchFields.length > 0) {
          const conditions = searchFields.map((f) => `${f}.ilike.%${q}%`);
          query = query.or(conditions.join(","));
        }

        if (!singleton) query = query.order(orderBy, { ascending: true });
        const { data, error, count } = singleton
          ? await query.limit(1).maybeSingle()
          : await query;

        if (error) throw error;

        // Cache headers for public endpoints
        res.set("Cache-Control", "public, max-age=60, s-maxage=120");
        res.set("Surrogate-Control", "max-age=120");
        res.json({ success: true, data, count: singleton ? undefined : count });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // GET /api/<resource>/featured
    featured: async (req, res) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("featured", true)
          .order(orderBy, { ascending: true });
        if (error) throw error;
        res.set("Cache-Control", "public, max-age=60");
        res.json({ success: true, data });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // GET /api/<resource>/search  — full-text search
    search: async (req, res) => {
      try {
        const q = req.query.q || "";
        if (!q.trim()) {
          return controller.list(req, res);
        }
        // Try full-text search vector first, fall back to ilike
        let query = supabase
          .from(table)
          .select("*")
          .textSearch("search_vector", q, { config: "english" })
          .order("search_vector", { ascending: false });
        const { data, error } = await query;
        if (error) {
          // Fallback: return list
          return controller.list(req, res);
        }
        res.set("Cache-Control", "public, max-age=60");
        res.json({ success: true, data });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // GET /api/<resource>/stats — count aggregate
    stats: async (req, res) => {
      try {
        const { count, error } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        if (error) throw error;
        res.json({ success: true, data: { table, count } });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // GET /api/<resource>/:id
    getOne: async (req, res) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", req.params.id)
          .single();
        if (error) throw error;
        res.set("Cache-Control", "public, max-age=60");
        res.json({ success: true, data });
      } catch (err) {
        res.status(404).json({ success: false, message: err.message });
      }
    },

    // POST /api/admin/<resource>
    create: async (req, res) => {
      try {
        const payload = { ...req.body };
        // Strip id if empty to allow auto-generation
        if (!payload.id || payload.id === "") delete payload.id;
        const { data, error } = await supabase
          .from(table)
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        res.status(201).json({ success: true, data });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },

    // PUT /api/admin/<resource>/:id
    update: async (req, res) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .update({ ...req.body, updated_at: new Date().toISOString() })
          .eq("id", req.params.id)
          .select()
          .single();
        if (error) throw error;
        res.json({ success: true, data });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },

    // PATCH /api/admin/<resource>/:id (partial update)
    patch: async (req, res) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .update({ ...req.body, updated_at: new Date().toISOString() })
          .eq("id", req.params.id)
          .select()
          .single();
        if (error) throw error;
        res.json({ success: true, data });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },

    // DELETE /api/admin/<resource>/:id
    remove: async (req, res) => {
      try {
        const { error } = await supabase.from(table).delete().eq("id", req.params.id);
        if (error) throw error;
        res.json({ success: true });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },

    // Bulk DELETE: DELETE /api/admin/<resource>/bulk?ids=id1,id2,id3
    bulkRemove: async (req, res) => {
      try {
        const ids = req.query.ids?.split(",").filter(Boolean) || [];
        if (ids.length === 0) {
          return res.status(400).json({ success: false, message: "No ids provided" });
        }
        const { error } = await supabase.from(table).delete().in("id", ids);
        if (error) throw error;
        res.json({ success: true, deleted: ids.length });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    },
  };

  return controller;
}

module.exports = crudFactory;