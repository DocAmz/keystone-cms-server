"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");
var import_cors = __toESM(require("cors"));

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      })
    }
  }),
  Post: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      content: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      author: (0, import_fields.relationship)({
        ref: "User.posts",
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true
        },
        many: false
      }),
      tags: (0, import_fields.relationship)({
        ref: "Tag.posts",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      })
    }
  }),
  Tag: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      isHidden: true
    },
    fields: {
      name: (0, import_fields.text)(),
      posts: (0, import_fields.relationship)({ ref: "Post.tags", many: true })
    }
  }),
  Page: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      content: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      banner: (0, import_fields.image)({ storage: "my_images" }),
      attachment: (0, import_fields.file)({ storage: "my_files" }),
      isPublished: (0, import_fields.checkbox)({ defaultValue: false, label: "Published" })
    }
  }),
  Message: (0, import_core.list)({
    access: import_access.allowAll,
    ui: {
      listView: {
        initialColumns: ["name", "email", "phone", "enquiryType", "message", "date"]
      }
    },
    fields: {
      name: (0, import_fields.text)(),
      email: (0, import_fields.text)(),
      phone: (0, import_fields.text)(),
      enquiryType: (0, import_fields.text)(),
      message: (0, import_fields.text)({
        ui: {
          displayMode: "textarea"
        }
      }),
      date: (0, import_fields.calendarDay)()
    }
  })
};

// storage.config.ts
var {
  ASSET_BASE_URL
} = process.env;
var storageConfig = {
  my_images: {
    kind: "local",
    type: "image",
    generateUrl: (path) => `http://localhost:3000/images${path}`,
    serverRoute: {
      path: "/images"
    },
    storagePath: "public/images"
  },
  my_files: {
    kind: "local",
    type: "file",
    generateUrl: (path) => `http://localhost:3000/files${path}`,
    serverRoute: {
      path: "/files"
    },
    storagePath: "public/files"
  }
};

// routes/pages.ts
async function getPages(req, res, context) {
  const pages = await context.query.Page.findMany({
    query: `
      title
      content {
        document
      }
      banner {
        url
      }
      isPublished
    `
  });
  res.json(pages);
}

// routes/contact.ts
async function postContact(req, res, context) {
  const body = req.body;
  console.log(body);
  const date = /* @__PURE__ */ new Date();
  const formattedDate = date.toISOString().split("T")[0];
  const { name, email, phone, enquiryType, message } = body;
  try {
    if (!name || !email || !phone || !enquiryType || !message) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    const contact = await context.query.Message.createOne({
      data: {
        name,
        email,
        phone,
        enquiryType,
        message,
        date: formattedDate
      }
    });
    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// access/access.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_roarr = require("roarr");
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    try {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        console.error("JWT_SECRET_KEY is not set in the environment");
        res.sendStatus(500);
      } else {
        const decodedToken = import_jsonwebtoken.default.verify(bearerToken, secretKey);
        const frontAPIkey = process.env.FRONT_API_KEY;
        if (typeof decodedToken !== "object") {
          console.error("Invalid token");
          res.statusMessage = "Invalid token";
          res.sendStatus(403);
        }
        if (typeof decodedToken === "object" && !decodedToken.hasOwnProperty("sub")) {
          console.error("Invalid token: sub missing");
          res.statusMessage = "Invalid token: sub missing";
          res.sendStatus(403);
        }
        if (decodedToken.sub !== frontAPIkey) {
          console.error("Invalid token: API_KEY value");
          res.statusMessage = "Invalid token: API_KEY value";
          res.sendStatus(403);
        }
        req.token = bearerToken;
        next();
      }
    } catch (err) {
      import_roarr.Roarr.error(err);
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
}

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var import_body_parser = __toESM(require("body-parser"));
function withContext(commonContext, f) {
  return async (req, res) => {
    ensureToken(req, res, () => f(req, res, commonContext));
  };
}
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    server: {
      extendExpressApp: (app, commonContext) => {
        app.use((0, import_cors.default)({ origin: "http://localhost:3001" }));
        app.use(import_body_parser.default.urlencoded({ extended: true }));
        app.use(import_body_parser.default.json());
        app.get("/api", withContext(commonContext, (req, res, context) => {
          res.render("index", { title: "Express" });
        }));
        app.get("/api/pages", withContext(commonContext, getPages));
        app.post("/api/contact", withContext(commonContext, postContact));
      }
    },
    lists,
    session,
    storage: storageConfig
  })
);
//# sourceMappingURL=config.js.map
