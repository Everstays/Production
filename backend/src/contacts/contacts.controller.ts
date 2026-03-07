import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from '../dto/contact.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Body() createContactDto: CreateContactDto,
    @CurrentUser() user?: User | null,
  ) {
    // Use userId from JWT when logged in; otherwise from body (guest submissions)
    const dto = { ...createContactDto };
    if (user?.id) {
      dto.userId = user.id;
    }
    return this.contactsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('status') status?: string,
    @Query('subject') subject?: string,
    @Query('userId') userId?: string,
  ) {
    return this.contactsService.findAll({ status, subject, userId });
  }

  @Get('my-contacts')
  @UseGuards(JwtAuthGuard)
  findMyContacts(@CurrentUser() user: User) {
    return this.contactsService.findAll({ userId: user.id });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getStats() {
    return this.contactsService.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @CurrentUser() user: User,
  ) {
    return this.contactsService.update(id, updateContactDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
