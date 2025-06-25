import { Injectable, NotFoundException,Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { TaskStatus } from './task-status-enum';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { GetTasksFilterDto } from 'src/dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  // private tasks: Task[] = [];

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  async getTaskByid(id: string, user: UserEntity): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task with id "${id} not found "`);
    }
    return found;
  }

  // getTaskByid(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`task with ID "${id}" not found `);
  //   }
  //   return found;
  // }
  // async getAllTask(): Promise<Task[]> {
  //   const found = await this.taskRepository.find();
  //   if (!found) {
  //     throw new NotFoundException('no task is created yet ');
  //   }
  //   return found;
  // }
  // tasks.service.ts
  async getAllTask(
    filterDto: GetTasksFilterDto,
    user: UserEntity,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No tasks found for this user');
    }
    return tasks;
  }

  // getTaskswithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;

  //   const task: Task = {

  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }
  async deleteTask(id: string, user: UserEntity): Promise<void> {
    const found = await this.taskRepository.delete({ id, user });
    console.log(found);
    if (found.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  // deleteTask(id: string): void {
  //   const found = this.getTaskByid(id)
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.getTaskByid(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
