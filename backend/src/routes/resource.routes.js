const express = require("express");
const crudFactory = require("../controllers/crudFactory");
const { requireAuth } = require("../middleware/auth");

function buildPublicRouter(table, options = {}) {
    const controller = crudFactory(table, options);
    const router = express.Router();

    router.get("/", controller.list);

    router.get("/featured", controller.featured || controller.list);

    router.get("/search", controller.search || controller.list);

    router.get("/stats", controller.stats || controller.list);

    router.get("/:id", controller.getOne);

    return router;
}

function buildAdminRouter(table, options = {}) {
    const controller = crudFactory(table, options);
    const router = express.Router();

    router.use(requireAuth);

    router.get("/", controller.list);

    router.get("/featured", controller.featured || controller.list);

    router.get("/search", controller.search || controller.list);

    router.get("/stats", controller.stats || controller.list);

    router.get("/:id", controller.getOne);

    router.post("/", controller.create);

    router.put("/:id", controller.update);

    router.patch("/:id", controller.update);

    router.delete("/:id", controller.remove);

    return router;
}

module.exports = {
    buildPublicRouter,
    buildAdminRouter
};