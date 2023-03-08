"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mockPrismaCreate = jest.fn();
const mockPrismaFindUnique = jest.fn();
jest.mock('../../../src/data/db/db.client', () => {
    return {
        dbClient: {
            user: {
                create: mockPrismaCreate,
                findUnique: mockPrismaFindUnique
            }
        }
    };
});
const db_client_1 = require("../../../src/data/db/db.client");
const exception_1 = require("../../../src/data/exception");
const repository_1 = require("../../../src/data/repository");
const libs = __importStar(require("../../../src/utils/libs"));
const client_1 = require("@prisma/client");
describe("User: Insert", () => {
    test('user without email or password is not validate', () => {
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        repository.insert("", "").catch(e => {
            expect(e).toBeInstanceOf(exception_1.RequireFieldException);
            expect(e.message).toEqual("missing fields: email,password");
        });
    });
    test("user creation failed when email has incorrect format", () => {
        const email = "incorrect_email_address";
        const password = "12345";
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        repository.insert(email, password).catch(e => {
            expect(e).toBeInstanceOf(exception_1.ValidationException);
            expect(e.message).toEqual("email is invalid");
        });
    });
    test("user created with email and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResponse = { id: 1 };
        mockPrismaCreate.mockResolvedValue(mockResponse);
        const saltSpy = jest.spyOn(libs, 'createRandomSalt').mockReturnValue("salt");
        const hashSpy = jest.spyOn(libs, 'createHashPassword').mockReturnValue("hash");
        const email = "e@gmail.com";
        const password = "12345";
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        const actual = yield repository.insert(email, password);
        expect(actual.id).toEqual(mockResponse.id);
        expect(mockPrismaCreate).toHaveBeenCalledTimes(1);
        expect(mockPrismaCreate).toHaveBeenCalledWith({
            data: {
                email: email,
                salt: "salt",
                hash_password: "hash"
            }
        });
        hashSpy.mockRestore();
        saltSpy.mockRestore();
    }));
    test("password must be hash through user creation", () => __awaiter(void 0, void 0, void 0, function* () {
        const hashSpy = jest.spyOn(libs, 'createHashPassword');
        const email = "e@gmail.com";
        const password = "1234";
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        yield repository.insert(email, password);
        expect(hashSpy).toHaveBeenCalledTimes(1);
        hashSpy.mockRestore();
    }));
    test("users with same email are invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        mockPrismaCreate.mockImplementation(() => {
            throw new client_1.Prisma.PrismaClientKnownRequestError("", { code: "P2002", clientVersion: "1" });
        });
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        repository.insert("same@email.com", "1234").catch(e => {
            expect(e).toBeInstanceOf(exception_1.DuplicateRecordException);
            mockPrismaCreate.mockRestore();
        });
    }));
});
describe("User: Find", () => {
    it("should return UserDTO when search an email", () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeUser = {
            id: 1,
            email: "elias.mohammady91@gmail.com"
        };
        mockPrismaFindUnique.mockResolvedValue(fakeUser);
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        const user = yield repository.fetchBy(fakeUser.email);
        expect(user.email).toEqual(fakeUser.email);
        expect(mockPrismaFindUnique).toHaveBeenCalledTimes(1);
        expect(mockPrismaFindUnique).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email
            }
        });
        mockPrismaFindUnique.mockRestore();
    }));
    it("should return an empty user when use not found", () => __awaiter(void 0, void 0, void 0, function* () {
        mockPrismaFindUnique.mockResolvedValue(null);
        const repository = new repository_1.UserRepository(db_client_1.dbClient);
        const user = yield repository.fetchBy("some-email");
        expect(user).toEqual({
            id: -1,
            email: ""
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNsQyxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtJQUM3QyxPQUFPO1FBQ0gsUUFBUSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNGLE1BQU0sRUFBRSxnQkFBZ0I7Z0JBQ3hCLFVBQVUsRUFBRSxvQkFBb0I7YUFDbkM7U0FDSjtLQUNKLENBQUE7QUFDTCxDQUFDLENBQUMsQ0FBQTtBQUdGLDhEQUF1RDtBQUN2RCwyREFBaUg7QUFDakgsNkRBQTZFO0FBRTdFLDhEQUErQztBQUMvQywyQ0FBcUM7QUFFckMsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDMUIsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUN4RCxNQUFNLFVBQVUsR0FBb0IsSUFBSSwyQkFBYyxDQUFDLG9CQUFRLENBQUMsQ0FBQTtRQUVoRSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxpQ0FBcUIsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsTUFBTSxLQUFLLEdBQVcs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QUMsQ0FBQSxDQUFDLENBQUE7SUFDRixFQUFFLENBQUMsZ0RBQWdELEVBQUUsR0FBUyxFQUFFO1FBQzVELG9CQUFvQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVDLE1BQU0sVUFBVSxHQUFvQixJQUFJLDJCQUFjLENBQUMsb0JBQVEsQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sSUFBSSxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDTixLQUFLLEVBQUUsRUFBRTtTQUNaLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG1vY2tQcmlzbWFDcmVhdGUgPSBqZXN0LmZuKClcclxuY29uc3QgbW9ja1ByaXNtYUZpbmRVbmlxdWUgPSBqZXN0LmZuKClcclxuamVzdC5tb2NrKCcuLi8uLi8uLi9zcmMvZGF0YS9kYi9kYi5jbGllbnQnLCAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRiQ2xpZW50OiB7XHJcbiAgICAgICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgICAgIGNyZWF0ZTogbW9ja1ByaXNtYUNyZWF0ZSxcclxuICAgICAgICAgICAgICAgIGZpbmRVbmlxdWU6IG1vY2tQcmlzbWFGaW5kVW5pcXVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcblxyXG5cclxuaW1wb3J0IHtkYkNsaWVudH0gZnJvbSAnLi4vLi4vLi4vc3JjL2RhdGEvZGIvZGIuY2xpZW50J1xyXG5pbXBvcnQge0R1cGxpY2F0ZVJlY29yZEV4Y2VwdGlvbiwgUmVxdWlyZUZpZWxkRXhjZXB0aW9uLCBWYWxpZGF0aW9uRXhjZXB0aW9ufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2RhdGEvZXhjZXB0aW9uXCI7XHJcbmltcG9ydCB7SVVzZXJSZXBvc2l0b3J5LCBVc2VyUmVwb3NpdG9yeX0gZnJvbSAnLi4vLi4vLi4vc3JjL2RhdGEvcmVwb3NpdG9yeSc7XHJcbmltcG9ydCB7VXNlckRUTywgVXNlcklkRFRPfSBmcm9tICcuLi8uLi8uLi9zcmMvZGF0YS9kdG8nO1xyXG5pbXBvcnQgKiBhcyBsaWJzIGZyb20gJy4uLy4uLy4uL3NyYy91dGlscy9saWJzJ1xyXG5pbXBvcnQge1ByaXNtYX0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5kZXNjcmliZShcIlVzZXI6IEluc2VydFwiLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCd1c2VyIHdpdGhvdXQgZW1haWwgb3IgcGFzc3dvcmQgaXMgbm90IHZhbGlkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcG9zaXRvcnk6IElVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeShkYkNsaWVudClcclxuXHJcbiAgICAgICAgcmVwb3NpdG9yeS5pbnNlcnQoXCJcIiwgXCJcIikuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIGV4cGVjdChlKS50b0JlSW5zdGFuY2VPZihSZXF1aXJlRmllbGRFeGNlcHRpb24pXHJcbiAgICAgICAgICAgIGV4cGVjdChlLm1lc3NhZ2UpLnRvRXF1YWwoXCJtaXNzaW5nIGZpZWxkczogZW1haWwscGFzc3dvcmRcIilcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwidXNlciBjcmVhdGlvbiBmYWlsZWQgd2hlbiBlbWFpbCBoYXMgaW5jb3JyZWN0IGZvcm1hdFwiLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgZW1haWw6IHN0cmluZyA9IFwiaW5jb3JyZWN0X2VtYWlsX2FkZHJlc3NcIjtcclxuICAgICAgICBjb25zdCBwYXNzd29yZDogc3RyaW5nID0gXCIxMjM0NVwiO1xyXG4gICAgICAgIGNvbnN0IHJlcG9zaXRvcnk6IElVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeShkYkNsaWVudClcclxuXHJcbiAgICAgICAgcmVwb3NpdG9yeS5pbnNlcnQoZW1haWwsIHBhc3N3b3JkKS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KGUpLnRvQmVJbnN0YW5jZU9mKFZhbGlkYXRpb25FeGNlcHRpb24pXHJcbiAgICAgICAgICAgIGV4cGVjdChlLm1lc3NhZ2UpLnRvRXF1YWwoXCJlbWFpbCBpcyBpbnZhbGlkXCIpXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbiAgICB0ZXN0KFwidXNlciBjcmVhdGVkIHdpdGggZW1haWwgYW5kIHBhc3N3b3JkXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBjb25zdCBtb2NrUmVzcG9uc2UgPSB7aWQ6IDF9XHJcbiAgICAgICAgbW9ja1ByaXNtYUNyZWF0ZS5tb2NrUmVzb2x2ZWRWYWx1ZShtb2NrUmVzcG9uc2UpXHJcblxyXG4gICAgICAgIGNvbnN0IHNhbHRTcHkgPSBqZXN0LnNweU9uKGxpYnMsICdjcmVhdGVSYW5kb21TYWx0JykubW9ja1JldHVyblZhbHVlKFwic2FsdFwiKVxyXG4gICAgICAgIGNvbnN0IGhhc2hTcHkgPSBqZXN0LnNweU9uKGxpYnMsICdjcmVhdGVIYXNoUGFzc3dvcmQnKS5tb2NrUmV0dXJuVmFsdWUoXCJoYXNoXCIpXHJcblxyXG5cclxuICAgICAgICBjb25zdCBlbWFpbCA9IFwiZUBnbWFpbC5jb21cIlxyXG4gICAgICAgIGNvbnN0IHBhc3N3b3JkID0gXCIxMjM0NVwiXHJcblxyXG4gICAgICAgIGNvbnN0IHJlcG9zaXRvcnk6IElVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeShkYkNsaWVudClcclxuXHJcbiAgICAgICAgY29uc3QgYWN0dWFsOiBVc2VySWREVE8gPSBhd2FpdCByZXBvc2l0b3J5Lmluc2VydChlbWFpbCwgcGFzc3dvcmQpXHJcblxyXG4gICAgICAgIGV4cGVjdChhY3R1YWwuaWQpLnRvRXF1YWwobW9ja1Jlc3BvbnNlLmlkKVxyXG4gICAgICAgIGV4cGVjdChtb2NrUHJpc21hQ3JlYXRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgICAgICBleHBlY3QobW9ja1ByaXNtYUNyZWF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBlbWFpbDogZW1haWwsXHJcbiAgICAgICAgICAgICAgICBzYWx0OiBcInNhbHRcIixcclxuICAgICAgICAgICAgICAgIGhhc2hfcGFzc3dvcmQ6IFwiaGFzaFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIGhhc2hTcHkubW9ja1Jlc3RvcmUoKVxyXG4gICAgICAgIHNhbHRTcHkubW9ja1Jlc3RvcmUoKVxyXG5cclxuICAgIH0pXHJcblxyXG4gICAgdGVzdChcInBhc3N3b3JkIG11c3QgYmUgaGFzaCB0aHJvdWdoIHVzZXIgY3JlYXRpb25cIiwgYXN5bmMgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBoYXNoU3B5ID0gamVzdC5zcHlPbihsaWJzLCAnY3JlYXRlSGFzaFBhc3N3b3JkJylcclxuXHJcbiAgICAgICAgY29uc3QgZW1haWwgPSBcImVAZ21haWwuY29tXCI7XHJcbiAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBcIjEyMzRcIjtcclxuXHJcbiAgICAgICAgY29uc3QgcmVwb3NpdG9yeTogSVVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KGRiQ2xpZW50KVxyXG4gICAgICAgIGF3YWl0IHJlcG9zaXRvcnkuaW5zZXJ0KGVtYWlsLCBwYXNzd29yZClcclxuXHJcbiAgICAgICAgZXhwZWN0KGhhc2hTcHkpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgICAgIGhhc2hTcHkubW9ja1Jlc3RvcmUoKVxyXG4gICAgfSlcclxuXHJcbiAgICB0ZXN0KFwidXNlcnMgd2l0aCBzYW1lIGVtYWlsIGFyZSBpbnZhbGlkXCIsIGFzeW5jICgpID0+IHtcclxuXHJcbiAgICAgICAgbW9ja1ByaXNtYUNyZWF0ZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgUHJpc21hLlByaXNtYUNsaWVudEtub3duUmVxdWVzdEVycm9yKFwiXCIsIHtjb2RlOiBcIlAyMDAyXCIsIGNsaWVudFZlcnNpb246IFwiMVwifSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnN0IHJlcG9zaXRvcnk6IElVc2VyUmVwb3NpdG9yeSA9IG5ldyBVc2VyUmVwb3NpdG9yeShkYkNsaWVudClcclxuICAgICAgICByZXBvc2l0b3J5Lmluc2VydChcInNhbWVAZW1haWwuY29tXCIsIFwiMTIzNFwiKS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KGUpLnRvQmVJbnN0YW5jZU9mKER1cGxpY2F0ZVJlY29yZEV4Y2VwdGlvbilcclxuICAgICAgICAgICAgbW9ja1ByaXNtYUNyZWF0ZS5tb2NrUmVzdG9yZSgpXHJcbiAgICAgICAgfSlcclxuXHJcblxyXG4gICAgfSlcclxufSlcclxuXHJcbmRlc2NyaWJlKFwiVXNlcjogRmluZFwiLCAoKSA9PiB7XHJcbiAgICBpdChcInNob3VsZCByZXR1cm4gVXNlckRUTyB3aGVuIHNlYXJjaCBhbiBlbWFpbFwiLCBhc3luYyAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGZha2VVc2VyID0ge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgZW1haWw6IFwiZWxpYXMubW9oYW1tYWR5OTFAZ21haWwuY29tXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1vY2tQcmlzbWFGaW5kVW5pcXVlLm1vY2tSZXNvbHZlZFZhbHVlKGZha2VVc2VyKVxyXG5cclxuICAgICAgICBjb25zdCByZXBvc2l0b3J5OiBJVXNlclJlcG9zaXRvcnkgPSBuZXcgVXNlclJlcG9zaXRvcnkoZGJDbGllbnQpXHJcblxyXG5cclxuICAgICAgICBjb25zdCB1c2VyOiBVc2VyRFRPID0gYXdhaXQgcmVwb3NpdG9yeS5mZXRjaEJ5KGZha2VVc2VyLmVtYWlsKVxyXG5cclxuICAgICAgICBleHBlY3QodXNlci5lbWFpbCkudG9FcXVhbChmYWtlVXNlci5lbWFpbClcclxuICAgICAgICBleHBlY3QobW9ja1ByaXNtYUZpbmRVbmlxdWUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxyXG4gICAgICAgIGV4cGVjdChtb2NrUHJpc21hRmluZFVuaXF1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IGZha2VVc2VyLmVtYWlsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIG1vY2tQcmlzbWFGaW5kVW5pcXVlLm1vY2tSZXN0b3JlKClcclxuICAgIH0pXHJcbiAgICBpdChcInNob3VsZCByZXR1cm4gYW4gZW1wdHkgdXNlciB3aGVuIHVzZSBub3QgZm91bmRcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIG1vY2tQcmlzbWFGaW5kVW5pcXVlLm1vY2tSZXNvbHZlZFZhbHVlKG51bGwpXHJcbiAgICAgICAgY29uc3QgcmVwb3NpdG9yeTogSVVzZXJSZXBvc2l0b3J5ID0gbmV3IFVzZXJSZXBvc2l0b3J5KGRiQ2xpZW50KVxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCByZXBvc2l0b3J5LmZldGNoQnkoXCJzb21lLWVtYWlsXCIpXHJcbiAgICAgICAgZXhwZWN0KHVzZXIpLnRvRXF1YWwoe1xyXG4gICAgICAgICAgICBpZDogLTEsXHJcbiAgICAgICAgICAgIGVtYWlsOiBcIlwiXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbn0pIl19