import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodTypeAny } from "zod";

export const validateBody = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "بيانات الطلب غير صالحة",
                errors: result.error.flatten(),
            });
        }

        req.body = result.data;
        next();
    };
};

export const validateParams = (schema: AnyZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                message: "معلمات الرابط غير صالحة",
                errors: result.error.flatten(),
            });
        }

        req.params = result.data as Record<string, string>;
        next();
    };
};
