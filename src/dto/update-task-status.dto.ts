/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum } from 'class-validator';
import { TaskStatus } from 'src/tasks/task-status-enum';

export class UpdatedTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
