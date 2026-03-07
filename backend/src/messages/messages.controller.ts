import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from '../dto/message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: User) {
    return this.messagesService.create(createMessageDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.messagesService.findAll(user);
  }

  @Get('conversation/:userId')
  findConversation(
    @Param('userId') userId: string,
    @Query('propertyId') propertyId: string,
    @CurrentUser() user: User,
  ) {
    return this.messagesService.findConversation(
      user.id,
      userId,
      propertyId,
    );
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: User) {
    return this.messagesService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: User) {
    return this.messagesService.markAsRead(id, user);
  }
}
