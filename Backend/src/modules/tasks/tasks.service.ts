import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTaskDto, userId: string) {
    const data: any = { ...createDto, userId };
    return this.prisma.task.create({ data });
  }

  async findAll(userId?: string) {
    return this.prisma.task.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId?: string) {
    const task = await this.findOne(id);
    if (userId && task.userId !== userId)
      throw new ForbiddenException('Not allowed to update this task');
    return this.prisma.task.update({
      where: { id },
      data: dto as UpdateTaskDto,
    });
  }

  async remove(id: string, userId?: string) {
    const task = await this.findOne(id);
    if (userId && task.userId !== userId)
      throw new ForbiddenException('Not allowed to delete this task');
    await this.prisma.task.delete({ where: { id } });
    return { message: 'Task deleted successfully' };
  }
}
