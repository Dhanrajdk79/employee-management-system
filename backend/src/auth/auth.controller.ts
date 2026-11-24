
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new employee account.',
  })
  @ApiCreatedResponse({
    description: 'User registered successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid registration data',
  })
  @ApiConflictResponse({
    description: 'Email already registered',
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and generate JWT access token.',
  })
  @ApiOkResponse({
    description: 'Login successful. JWT access token returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
  })
  @ApiBadRequestResponse({
    description: 'Invalid login data',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({
    summary: 'Get authenticated user profile',
  })
  @ApiOkResponse({
    description: 'Authenticated user profile returned',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid JWT token',
  })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Authenticated successfully',
      user,
    };
  }
}
