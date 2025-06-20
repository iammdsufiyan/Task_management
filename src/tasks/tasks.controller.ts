import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdatedTaskStatusDto } from 'src/dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  //   @Get()
  //   getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if (Object.keys(filterDto).length) {
  //       return this.tasksService.getTaskswithFilters(filterDto);
  //     } else {
  //       return this.tasksService.getAllTasks();
  //     }
  //   }
  @Get('/:id')
  getTaskByid(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskByid(id);
  }
  //   @Get('/:id')
  //   getTaskByid(@Param('id') id: string): Task {
  //     return this.tasksService.getTaskByid(id);
  //   }

  @Post()
  createTask(@Body() CreateTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(CreateTaskDto);
  }
  //   @Post()
  //   createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     return this.tasksService.createTask(createTaskDto);
  //   }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  //   @Delete('/:id')
  //   deleteTask(@Param('id') id: string): void {
  //     return this.tasksService.deleteTask(id);
  //   }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updatedTaskStatusDto: UpdatedTaskStatusDto,
  ): Promise<Task> {
    const { status } = updatedTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }

  //   @Patch('/:id/status')
  //   updatedTaskStatus(
  //     @Param('id') id: string,
  //     @Body() updatedTaskStatusDto: UpdatedTaskStatusDto,
  //   ): Task {
  //     const { status } = updatedTaskStatusDto;
  //     return this.tasksService.updatedTaskStatus(id, status);
  //   }
}
