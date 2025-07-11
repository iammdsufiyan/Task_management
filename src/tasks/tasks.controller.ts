import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from 'src/dto/create-task.dto';
import { UpdatedTaskStatusDto } from 'src/dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorater';
import { UserEntity } from 'src/auth/user.entity';
import { GetTasksFilterDto } from 'src/dto/get-tasks-filter.dto';
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TaskController');
  constructor(private tasksService: TasksService) {}

  //   @Get()
  //   getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if (Object.keys(filterDto).length) {
  //       return this.tasksService.getTaskswithFilters(filterDto);
  //     } else {
  //       return this.tasksService.getAllTasks();
  //     }
  //   }
  @Get()
  getAllTask(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getAllTask(filterDto, user);
  }

  @Get('/:id')
  getTaskByid(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    return this.tasksService.getTaskByid(id, user);
  }
  //   @Get('/:id')
  //   getTaskByid(@Param('id') id: string): Task {
  //     return this.tasksService.getTaskByid(id);
  //   }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }
  //   @Post()
  //   createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     return this.tasksService.createTask(createTaskDto);
  //   }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  //   @Delete('/:id')
  //   deleteTask(@Param('id') id: string): void {
  //     return this.tasksService.deleteTask(id);
  //   }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updatedTaskStatusDto: UpdatedTaskStatusDto,
    @GetUser() user: UserEntity,
  ): Promise<Task> {
    const { status } = updatedTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status, user);
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
