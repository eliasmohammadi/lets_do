"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const app = (0, supertest_1.default)(app_1.default);
describe("User Api: create", () => {
    it("should return 400 for invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.post('/api/user')
            .set("Accept", "application/json")
            .send({
            email: "bad-email",
            password: "12345"
        });
        expect(response.body).toEqual({ error: "email is invalid" });
        expect(response.statusCode).toEqual(400);
    }));
    it("should return 400 for empty request", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.post('/api/user')
            .set("Accept", "application/json")
            .send({});
        expect(response.body).toEqual({ error: "missing fields: email,password" });
        expect(response.statusCode).toEqual(400);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLDBEQUErQjtBQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFBLG1CQUFPLEVBQUMsYUFBTSxDQUFDLENBQUE7QUFHM0IsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUc5QixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBUyxFQUFFO1FBQzdDLE1BQU0sUUFBUSxHQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7YUFDeEMsR0FBRyxDQUFDLFFBQVEsRUFBQyxrQkFBa0IsQ0FBQzthQUNoQyxJQUFJLENBQUM7WUFDRixLQUFLLEVBQUMsV0FBVztZQUNqQixRQUFRLEVBQUMsT0FBTztTQUNuQixDQUFDLENBQUE7UUFFVixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLEtBQUssRUFBQyxrQkFBa0IsRUFBQyxDQUFDLENBQUE7UUFDekQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDNUMsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxxQ0FBcUMsRUFBRSxHQUFTLEVBQUU7UUFDakQsTUFBTSxRQUFRLEdBQUksTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUN4QyxHQUFHLENBQUMsUUFBUSxFQUFDLGtCQUFrQixDQUFDO2FBQ2hDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUViLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsS0FBSyxFQUFDLGdDQUFnQyxFQUFDLENBQUMsQ0FBQTtRQUN2RSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM1QyxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRU4sQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmVyIGZyb20gJy4uLy4uL3NyYy9hcHAnXHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3N1cGVydGVzdCdcclxuXHJcbmNvbnN0IGFwcCA9IHJlcXVlc3Qoc2VydmVyKVxyXG5cclxuXHJcbmRlc2NyaWJlKFwiVXNlciBBcGk6IGNyZWF0ZVwiLCAoKSA9PiB7XHJcblxyXG5cclxuICAgIGl0KFwic2hvdWxkIHJldHVybiA0MDAgZm9yIGludmFsaWQgZW1haWxcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSAgPSBhd2FpdCBhcHAucG9zdCgnL2FwaS91c2VyJylcclxuICAgICAgICAgICAgICAgIC5zZXQoXCJBY2NlcHRcIixcImFwcGxpY2F0aW9uL2pzb25cIilcclxuICAgICAgICAgICAgICAgIC5zZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDpcImJhZC1lbWFpbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOlwiMTIzNDVcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZXhwZWN0KHJlc3BvbnNlLmJvZHkpLnRvRXF1YWwoe2Vycm9yOlwiZW1haWwgaXMgaW52YWxpZFwifSlcclxuICAgICAgICBleHBlY3QocmVzcG9uc2Uuc3RhdHVzQ29kZSkudG9FcXVhbCg0MDApXHJcbiAgICB9KVxyXG5cclxuICAgIGl0KFwic2hvdWxkIHJldHVybiA0MDAgZm9yIGVtcHR5IHJlcXVlc3RcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlICA9IGF3YWl0IGFwcC5wb3N0KCcvYXBpL3VzZXInKVxyXG4gICAgICAgICAgICAuc2V0KFwiQWNjZXB0XCIsXCJhcHBsaWNhdGlvbi9qc29uXCIpXHJcbiAgICAgICAgICAgIC5zZW5kKHt9KVxyXG5cclxuICAgICAgICBleHBlY3QocmVzcG9uc2UuYm9keSkudG9FcXVhbCh7ZXJyb3I6XCJtaXNzaW5nIGZpZWxkczogZW1haWwscGFzc3dvcmRcIn0pXHJcbiAgICAgICAgZXhwZWN0KHJlc3BvbnNlLnN0YXR1c0NvZGUpLnRvRXF1YWwoNDAwKVxyXG4gICAgfSlcclxuXHJcbn0pIl19