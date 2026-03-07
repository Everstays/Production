import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CabRequestsService } from './cab-requests.service';
import { CreateCabRequestDto, AssignCabRequestDto } from '../dto/cab-request.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('cab-requests')
export class CabRequestsController {
  constructor(private readonly cabRequestsService: CabRequestsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Body() createCabRequestDto: CreateCabRequestDto,
    @CurrentUser() user?: User | null,
  ) {
    return this.cabRequestsService.create(
      createCabRequestDto,
      user ? user.id : null,
    );
  }

  @Get('for-host')
  @UseGuards(JwtAuthGuard)
  findForHost(@CurrentUser() user: User) {
    return this.cabRequestsService.findByHost(user.id);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard)
  assign(
    @Param('id') id: string,
    @Body() body: AssignCabRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.cabRequestsService.assign(id, body.cabId, user);
  }
}
