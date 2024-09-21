import "./modules/auth/auth.schema";
import "./modules/user/user.schema";
import "./resolvers";

import { builder } from "./builder";

const schema = builder.toSchema();
export default schema;
