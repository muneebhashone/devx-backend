import SchemaBuilder from "@pothos/core";
import {
  DateResolver,
  DateTimeResolver,
  EmailAddressResolver,
} from "graphql-scalars";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ZodPlugin from "@pothos/plugin-zod";
import { IUser } from "./modules/user/user.schema";

export const builder = new SchemaBuilder<{
  AuthScopes: {
    protected: boolean;
  };
  Scalars: {
    DateTime: {
      Input: string;
      Output: Date;
    };
    Date: {
      Input: string;
      Output: Date;
    };
    Email: {
      Input: string;
      Output: string;
    };
  };
  Context: {
    currentUser: IUser;
  };
}>({
  plugins: [ScopeAuthPlugin, ZodPlugin],
  scopeAuth: {
    authScopes: async (context) => ({
      protected: !!context.currentUser,
    }),
  },
  zod: {
    validationError: (zodError) => {
      return zodError;
    },
  },
});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("Email", EmailAddressResolver, {});

builder.queryType({});
builder.mutationType({});
