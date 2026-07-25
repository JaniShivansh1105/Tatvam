import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects } from "zod";

type ValidationSchema = AnyZodObject | ZodEffects<AnyZodObject>;

export const validateRequest =
  (schema: ValidationSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // We explicitly parse all three because some schemas might require combinations
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Override the request properties with the sanitized/parsed values safely.
      // req.body can be safely overwritten.
      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      // req.query and req.params often only have getters on the prototype in Express.
      // We mutate the existing object instead of reassigning the property.
      if (parsed.query !== undefined) {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, parsed.query);
      }

      if (parsed.params !== undefined) {
        Object.keys(req.params).forEach((key) => delete req.params[key]);
        Object.assign(req.params, parsed.params);
      }

      next();
    } catch (error) {
      // Pass the error to the global error handler which will format Zod errors
      next(error);
    }
  };
