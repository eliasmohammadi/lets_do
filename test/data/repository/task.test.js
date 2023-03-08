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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../src/utils");
const mockPrismaCreate = jest.fn();
const mockPrismaUpdate = jest.fn();
const mockPrismaDelete = jest.fn().mockResolvedValue({
    title: "title",
    id: 1
});
const mockPrismaFind = jest.fn();
jest.mock('../../../src/data/db/db.client', () => {
    return {
        dbClient: {
            task: {
                create: mockPrismaCreate,
                update: mockPrismaUpdate,
                delete: mockPrismaDelete,
                findMany: mockPrismaFind
            }
        }
    };
});
const entity_1 = require("../../../src/data/entity");
const repository_1 = require("../../../src/data/repository");
const db_client_1 = require("../../../src/data/db/db.client");
const exception_1 = require("../../../src/data/exception");
describe("Task Repository: insert", () => {
    it("should return Task object after insert task in database", () => __awaiter(void 0, void 0, void 0, function* () {
        mockPrismaCreate.mockResolvedValue({
            id: 1,
            title: "title",
            status: 0,
            due_date: (0, utils_1.getDate)(new Date()),
            description: "",
            user_id: -1
        });
        const repository = new repository_1.TaskRepository(db_client_1.dbClient);
        const task = {
            title: "title"
        };
        const result = yield repository.insert(task);
        const createMethodInput = {
            data: {
                title: "title",
                status: 0,
                description: "",
                due_date: (0, utils_1.getDate)(new Date())
            }
        };
        expect(mockPrismaCreate).toHaveBeenCalledWith(createMethodInput);
        expect(mockPrismaCreate).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            id: 1
        });
    }));
    test("task with empty title is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const repository = new repository_1.TaskRepository(db_client_1.dbClient);
        repository.insert({}).catch(e => {
            expect(e).toBeInstanceOf(exception_1.ValidationException);
            expect(e.message).toEqual(`title is invalid`);
        });
    }));
});
describe("Task Repository: update", () => {
    it("should return updated task", () => __awaiter(void 0, void 0, void 0, function* () {
        const repository = new repository_1.TaskRepository(db_client_1.dbClient);
        const updateObject = {
            id: 1,
            description: "new-description",
            status: entity_1.Task.Status.CLOSE
        };
        mockPrismaUpdate.mockResolvedValue({
            id: 1,
            description: updateObject.description,
            status: 2,
            title: "title",
            userId: -1,
            dueDate: (0, utils_1.getDate)(new Date())
        });
        const updatedTask = yield repository.updateTask(updateObject);
        expect(updatedTask.status).toEqual("CLOSE");
        expect(updatedTask.description).toEqual(updateObject.description);
        expect(mockPrismaUpdate).toHaveBeenCalledTimes(1);
        expect(mockPrismaUpdate).toHaveBeenCalledWith({
            where: {
                id: updateObject.id,
            }, data: updateObject
        });
    }));
});
describe("Task Repository: delete", () => {
    it("should delete task and return task id", () => __awaiter(void 0, void 0, void 0, function* () {
        const repository = new repository_1.TaskRepository(db_client_1.dbClient);
        const actual = yield repository.deleteTask(1);
        expect(actual).toEqual({
            id: 1
        });
    }));
});
describe("Task Repository: fetch", () => {
    it("should return task dto for given predictions", () => __awaiter(void 0, void 0, void 0, function* () {
        mockPrismaFind.mockResolvedValue({
            id: 1,
            title: "title",
            userId: 1,
            status: 2,
            description: "",
            dueDate: (0, utils_1.getDate)(new Date())
        });
        const prediction = {
            userId: 1,
            status: entity_1.Task.Status.CLOSE,
        };
        const repository = new repository_1.TaskRepository(db_client_1.dbClient);
        const actual = yield repository.fetchBy(prediction);
        expect(actual.userId).toEqual(prediction.userId);
        expect(mockPrismaFind).toHaveBeenCalledTimes(1);
        expect(mockPrismaFind).toHaveBeenCalledWith({
            where: prediction
        });
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidGFzay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsOENBQTBDO0FBRTFDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2xDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2xDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQ2pELEtBQUssRUFBQyxPQUFPO0lBQ2IsRUFBRSxFQUFDLENBQUM7Q0FDUCxDQUFDLENBQUE7QUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFDN0MsT0FBTztRQUNILFFBQVEsRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDRixNQUFNLEVBQUUsZ0JBQWdCO2dCQUN4QixNQUFNLEVBQUUsZ0JBQWdCO2dCQUN4QixNQUFNLEVBQUUsZ0JBQWdCO2dCQUN4QixRQUFRLEVBQUUsY0FBYzthQUMzQjtTQUNKO0tBQ0osQ0FBQTtBQUNMLENBQUMsQ0FBQyxDQUFBO0FBRUYscURBQTZDO0FBQzdDLDZEQUEyRDtBQUMzRCw4REFBdUQ7QUFFdkQsMkRBQWdFO0FBRWhFLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7SUFDckMsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEdBQVMsRUFBRTtRQUNyRSxnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQztZQUMvQixFQUFFLEVBQUUsQ0FBQztZQUNMLEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLENBQUM7WUFDVCxRQUFRLEVBQUUsSUFBQSxlQUFPLEVBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUM3QixXQUFXLEVBQUUsRUFBRTtZQUNmLE9B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Q0FBQTtRQUNoRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDL0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1lBQ3hDLEtBQUssRUFBQyxVQUFVO1NBQ25CLENBQUMsQ0FBQTtJQUNOLENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDTixDQUFDLENBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Z2V0RGF0ZX0gZnJvbSBcIi4uLy4uLy4uL3NyYy91dGlsc1wiXHJcblxyXG5jb25zdCBtb2NrUHJpc21hQ3JlYXRlID0gamVzdC5mbigpXHJcbmNvbnN0IG1vY2tQcmlzbWFVcGRhdGUgPSBqZXN0LmZuKClcclxuY29uc3QgbW9ja1ByaXNtYURlbGV0ZSA9IGplc3QuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XHJcbiAgICB0aXRsZTpcInRpdGxlXCIsXHJcbiAgICBpZDoxXHJcbn0pXHJcbmNvbnN0IG1vY2tQcmlzbWFGaW5kID0gamVzdC5mbigpXHJcblxyXG5qZXN0Lm1vY2soJy4uLy4uLy4uL3NyYy9kYXRhL2RiL2RiLmNsaWVudCcsICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGJDbGllbnQ6IHtcclxuICAgICAgICAgICAgdGFzazoge1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlOiBtb2NrUHJpc21hQ3JlYXRlLFxyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiBtb2NrUHJpc21hVXBkYXRlLFxyXG4gICAgICAgICAgICAgICAgZGVsZXRlOiBtb2NrUHJpc21hRGVsZXRlLFxyXG4gICAgICAgICAgICAgICAgZmluZE1hbnk6IG1vY2tQcmlzbWFGaW5kXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcblxyXG5pbXBvcnQge1Rhc2t9IGZyb20gXCIuLi8uLi8uLi9zcmMvZGF0YS9lbnRpdHlcIlxyXG5pbXBvcnQge1Rhc2tSZXBvc2l0b3J5fSBmcm9tIFwiLi4vLi4vLi4vc3JjL2RhdGEvcmVwb3NpdG9yeVwiXHJcbmltcG9ydCB7ZGJDbGllbnR9IGZyb20gJy4uLy4uLy4uL3NyYy9kYXRhL2RiL2RiLmNsaWVudCdcclxuaW1wb3J0IHtUYXNrRFRPLCBUYXNrSWREVE99IGZyb20gXCIuLi8uLi8uLi9zcmMvZGF0YS9kdG9cIjtcclxuaW1wb3J0IHtWYWxpZGF0aW9uRXhjZXB0aW9ufSBmcm9tIFwiLi4vLi4vLi4vc3JjL2RhdGEvZXhjZXB0aW9uXCI7XHJcblxyXG5kZXNjcmliZShcIlRhc2sgUmVwb3NpdG9yeTogaW5zZXJ0XCIsICgpID0+IHtcclxuICAgIGl0KFwic2hvdWxkIHJldHVybiBUYXNrIG9iamVjdCBhZnRlciBpbnNlcnQgdGFzayBpbiBkYXRhYmFzZVwiLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgbW9ja1ByaXNtYUNyZWF0ZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XHJcbiAgICAgICAgICAgIGlkOiAxLFxyXG4gICAgICAgICAgICB0aXRsZTogXCJ0aXRsZVwiLFxyXG4gICAgICAgICAgICBzdGF0dXM6IDAsXHJcbiAgICAgICAgICAgIGR1ZV9kYXRlOiBnZXREYXRlKG5ldyBEYXRlKCkpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgICAgICAgICAgdXNlcl9pZDogLTFcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBjb25zdCByZXBvc2l0b3J5OiBUYXNrUmVwb3NpdG9yeSA9IG5ldyBUYXNrUmVwb3NpdG9yeShkYkNsaWVudClcclxuICAgICAgICBjb25zdCB0YXNrOiBQYXJ0aWFsPFRhc2s+ID0ge1xyXG4gICAgICAgICAgICB0aXRsZTpcInRpdGxlXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogVGFza0lkRFRPID0gYXdhaXQgcmVwb3NpdG9yeS5pbnNlcnQodGFzaylcclxuXHJcblxyXG4gICAgICAgIGNvbnN0IGNyZWF0ZU1ldGhvZElucHV0ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJ0aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAwLFxyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBkdWVfZGF0ZTogZ2V0RGF0ZShuZXcgRGF0ZSgpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGV4cGVjdChtb2NrUHJpc21hQ3JlYXRlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChjcmVhdGVNZXRob2RJbnB1dClcclxuICAgICAgICBleHBlY3QobW9ja1ByaXNtYUNyZWF0ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGlkOiAxXHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcbiAgICB0ZXN0KFwidGFzayB3aXRoIGVtcHR5IHRpdGxlIGlzIGludmFsaWRcIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcG9zaXRvcnk6IFRhc2tSZXBvc2l0b3J5ID0gbmV3IFRhc2tSZXBvc2l0b3J5KGRiQ2xpZW50KVxyXG4gICAgICAgIHJlcG9zaXRvcnkuaW5zZXJ0KHt9KS5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgZXhwZWN0KGUpLnRvQmVJbnN0YW5jZU9mKFZhbGlkYXRpb25FeGNlcHRpb24pXHJcbiAgICAgICAgICAgIGV4cGVjdChlLm1lc3NhZ2UpLnRvRXF1YWwoYHRpdGxlIGlzIGludmFsaWRgKVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG59KVxyXG5cclxuZGVzY3JpYmUoXCJUYXNrIFJlcG9zaXRvcnk6IHVwZGF0ZVwiLCAoKSA9PiB7XHJcbiAgICBpdChcInNob3VsZCByZXR1cm4gdXBkYXRlZCB0YXNrXCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICBjb25zdCByZXBvc2l0b3J5OiBUYXNrUmVwb3NpdG9yeSA9IG5ldyBUYXNrUmVwb3NpdG9yeShkYkNsaWVudCk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlT2JqZWN0OiBQYXJ0aWFsPFRhc2s+ID0ge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwibmV3LWRlc2NyaXB0aW9uXCIsXHJcbiAgICAgICAgICAgIHN0YXR1czogVGFzay5TdGF0dXMuQ0xPU0VcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1vY2tQcmlzbWFVcGRhdGUubW9ja1Jlc29sdmVkVmFsdWUoe1xyXG4gICAgICAgICAgICBpZDoxLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogdXBkYXRlT2JqZWN0LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICBzdGF0dXM6IDIsXHJcbiAgICAgICAgICAgIHRpdGxlOlwidGl0bGVcIixcclxuICAgICAgICAgICAgdXNlcklkOi0xLFxyXG4gICAgICAgICAgICBkdWVEYXRlOmdldERhdGUobmV3IERhdGUoKSlcclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlZFRhc2s6IFRhc2tEVE8gPSBhd2FpdCByZXBvc2l0b3J5LnVwZGF0ZVRhc2sodXBkYXRlT2JqZWN0KVxyXG5cclxuICAgICAgICBleHBlY3QodXBkYXRlZFRhc2suc3RhdHVzKS50b0VxdWFsKFwiQ0xPU0VcIilcclxuICAgICAgICBleHBlY3QodXBkYXRlZFRhc2suZGVzY3JpcHRpb24pLnRvRXF1YWwodXBkYXRlT2JqZWN0LmRlc2NyaXB0aW9uKVxyXG4gICAgICAgIGV4cGVjdChtb2NrUHJpc21hVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcclxuICAgICAgICBleHBlY3QobW9ja1ByaXNtYVVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHVwZGF0ZU9iamVjdC5pZCxcclxuICAgICAgICAgICAgICAgIH0sIGRhdGE6IHVwZGF0ZU9iamVjdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG5cclxuICAgIH0pXHJcbn0pXHJcblxyXG5kZXNjcmliZShcIlRhc2sgUmVwb3NpdG9yeTogZGVsZXRlXCIsKCkgPT4ge1xyXG4gICAgaXQoXCJzaG91bGQgZGVsZXRlIHRhc2sgYW5kIHJldHVybiB0YXNrIGlkXCIsIGFzeW5jKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCByZXBvc2l0b3J5OiBUYXNrUmVwb3NpdG9yeSA9IG5ldyBUYXNrUmVwb3NpdG9yeShkYkNsaWVudClcclxuXHJcbiAgICAgICAgY29uc3QgYWN0dWFsPSBhd2FpdCByZXBvc2l0b3J5LmRlbGV0ZVRhc2soMSlcclxuXHJcbiAgICAgICAgZXhwZWN0KGFjdHVhbCkudG9FcXVhbCh7XHJcbiAgICAgICAgICAgIGlkOjFcclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSApXHJcblxyXG5kZXNjcmliZShcIlRhc2sgUmVwb3NpdG9yeTogZmV0Y2hcIiwoKSA9PiB7XHJcbiAgICBpdChcInNob3VsZCByZXR1cm4gdGFzayBkdG8gZm9yIGdpdmVuIHByZWRpY3Rpb25zXCIsIGFzeW5jKCkgPT4ge1xyXG4gICAgICAgIG1vY2tQcmlzbWFGaW5kLm1vY2tSZXNvbHZlZFZhbHVlKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZDoxLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6XCJ0aXRsZVwiLFxyXG4gICAgICAgICAgICAgICAgdXNlcklkOjEsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6MixcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOlwiXCIsXHJcbiAgICAgICAgICAgICAgICBkdWVEYXRlOmdldERhdGUobmV3IERhdGUoKSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIClcclxuICAgICAgICBjb25zdCBwcmVkaWN0aW9uOiBQYXJ0aWFsPFRhc2s+ID0ge1xyXG4gICAgICAgICAgICB1c2VySWQ6IDEsXHJcbiAgICAgICAgICAgIHN0YXR1czpUYXNrLlN0YXR1cy5DTE9TRSxcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcmVwb3NpdG9yeTogVGFza1JlcG9zaXRvcnkgPSBuZXcgVGFza1JlcG9zaXRvcnkoZGJDbGllbnQpXHJcbiAgICAgICAgY29uc3QgYWN0dWFsID0gYXdhaXQgcmVwb3NpdG9yeS5mZXRjaEJ5KHByZWRpY3Rpb24pO1xyXG4gICAgICAgIGV4cGVjdChhY3R1YWwudXNlcklkKS50b0VxdWFsKHByZWRpY3Rpb24udXNlcklkKVxyXG4gICAgICAgIGV4cGVjdChtb2NrUHJpc21hRmluZCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXHJcbiAgICAgICAgZXhwZWN0KG1vY2tQcmlzbWFGaW5kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XHJcbiAgICAgICAgICAgIHdoZXJlOnByZWRpY3Rpb25cclxuICAgICAgICB9KVxyXG4gICAgfSlcclxufSApIl19