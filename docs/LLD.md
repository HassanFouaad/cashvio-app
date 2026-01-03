# Low-Level Design (LLD) - Detailed Implementation

## Table of Contents
1. [Backend Implementation](#1-backend-implementation)
2. [Frontend Implementation](#2-frontend-implementation)
3. [Database Schema Changes](#3-database-schema-changes)
4. [API Specifications](#4-api-specifications)

---

## 1. Backend Implementation

### 1.1 Plan Model Enhancement

#### Current Model
```typescript
// be/src/modules/subscriptions/models/plan.model.ts
@Table({ tableName: 'plans', timestamps: true })
export class Plan extends BaseEntity<PlanAttributes, PlanCreationAttributes> {
  @Column({ type: DataType.STRING(255), allowNull: false })
  arName: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  enName: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  price: number;

  @Column({ type: DataType.STRING(20), allowNull: false })
  period: PlanPeriod;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  isActive: boolean;
}
```

#### Enhanced Model
```typescript
// be/src/modules/subscriptions/models/plan.model.ts
interface PlanAttributes {
  id: string;
  arName: string;
  enName: string;
  detailsAr: string[];      // NEW
  detailsEn: string[];      // NEW
  price: number;
  period: PlanPeriod;
  isActive: boolean;
  isFreemium: boolean;      // NEW
  createdAt: Date;
  updatedAt: Date;
}

interface PlanCreationAttributes {
  arName: string;
  enName: string;
  detailsAr?: string[];     // NEW
  detailsEn?: string[];     // NEW
  price: number;
  period: PlanPeriod;
  isActive?: boolean;
  isFreemium?: boolean;     // NEW
}

@Table({ tableName: 'plans', timestamps: true })
export class Plan extends BaseEntity<PlanAttributes, PlanCreationAttributes> {
  // ... existing columns ...

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    defaultValue: [],
  })
  detailsAr: string[];

  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: true,
    defaultValue: [],
  })
  detailsEn: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isFreemium: boolean;
}
```

### 1.2 Plan DTOs

#### CreatePlanDto Enhancement
```typescript
// be/src/modules/subscriptions/dtos/create-plan.dto.ts
export class CreatePlanDto {
  @ApiProperty({ description: 'Plan name in Arabic', example: 'خطة شهرية' })
  @IsString()
  @IsNotEmpty()
  arName: string;

  @ApiProperty({ description: 'Plan name in English', example: 'Monthly Plan' })
  @IsString()
  @IsNotEmpty()
  enName: string;

  @ApiProperty({
    description: 'Plan details/features in Arabic',
    example: ['ميزة أولى', 'ميزة ثانية'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  detailsAr?: string[];

  @ApiProperty({
    description: 'Plan details/features in English',
    example: ['Feature one', 'Feature two'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  detailsEn?: string[];

  @ApiProperty({ description: 'Plan price', example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Plan period', enum: PlanPeriod })
  @IsEnum(PlanPeriod)
  period: PlanPeriod;

  @ApiProperty({ description: 'Whether the plan is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether this is the freemium plan (only one allowed)',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFreemium?: boolean;

  @ApiProperty({ description: 'Features to include', required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PlanFeatureItemDto)
  features?: PlanFeatureItemDto[];
}
```

#### PlanDto Enhancement
```typescript
// be/src/modules/subscriptions/dtos/plan.dto.ts
export class PlanDto {
  @ApiProperty({ description: 'Plan unique identifier' })
  id: string;

  @ApiProperty({ description: 'Plan name in Arabic' })
  arName: string;

  @ApiProperty({ description: 'Plan name in English' })
  enName: string;

  @ApiProperty({ description: 'Plan details in Arabic', type: [String] })
  detailsAr: string[];

  @ApiProperty({ description: 'Plan details in English', type: [String] })
  detailsEn: string[];

  @ApiProperty({ description: 'Plan price' })
  price: number;

  @ApiProperty({ description: 'Plan period', enum: PlanPeriod })
  period: PlanPeriod;

  @ApiProperty({ description: 'Whether the plan is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether this is the freemium plan' })
  isFreemium: boolean;

  @ApiProperty({ description: 'Plan creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Plan last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Plan features', type: () => [PlanFeatureDto] })
  planFeatures: PlanFeatureDto[];
}
```

### 1.3 Public Plans Controller

```typescript
// be/src/modules/subscriptions/controllers/public.plans.controller.ts
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { ApiResponse, ResponseTransformer } from '../../../core';
import { PaginatedResponseDto } from '../../../core/dtos/pagination.dto';
import { ListPublicPlansDto } from '../dtos/list-public-plans.dto';
import { PublicPlanDto } from '../dtos/public-plan.dto';
import { PlansService } from '../services/plans.service';

@Controller({ version: '1', path: 'public/plans' })
@ApiTags('Public Plans')
export class PublicPlansController {
  constructor(
    private readonly transformer: ResponseTransformer,
    private readonly plansService: PlansService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active plans (public)' })
  async findAll(
    @Query() query: ListPublicPlansDto,
  ): Promise<ApiResponse<PaginatedResponseDto<PublicPlanDto>>> {
    const plans = await this.plansService.findAllPublic(query);
    return this.transformer.transform(plans);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get plan by ID (public)' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<PublicPlanDto>> {
    const plan = await this.plansService.findByIdPublic(id);
    return this.transformer.transform(plan);
  }
}
```

### 1.4 Plans Service Enhancement

```typescript
// be/src/modules/subscriptions/services/plans.service.ts

// Add to existing PlansService class:

/**
 * Find all active plans for public API
 */
async findAllPublic(
  query?: ListPublicPlansDto,
): Promise<PaginatedResponseDto<PublicPlanDto>> {
  return this.plansRepository.findAllActivePlans(query);
}

/**
 * Find plan by ID for public API (only if active)
 */
async findByIdPublic(id: string): Promise<PublicPlanDto> {
  const plan = await this.plansRepository.findActiveById(id);
  if (!plan) {
    throw new ApiException(
      'subscriptions.errors.plan_not_found',
      HttpStatus.NOT_FOUND,
    );
  }
  return plan;
}

/**
 * Find the freemium plan
 */
async findFreemiumPlan(): Promise<PlanDto | null> {
  return this.plansRepository.findFreemiumPlan();
}

/**
 * Validate freemium uniqueness before create/update
 */
private async validateFreemiumUniqueness(
  isFreemium: boolean,
  excludeId?: string,
): Promise<void> {
  if (!isFreemium) return;
  
  const existingFreemium = await this.plansRepository.findFreemiumPlan();
  if (existingFreemium && existingFreemium.id !== excludeId) {
    throw new ApiException(
      'subscriptions.errors.freemium_plan_already_exists',
      HttpStatus.CONFLICT,
    );
  }
}
```

### 1.5 Plans Repository Enhancement

```typescript
// be/src/modules/subscriptions/repositories/plans.repository.ts

// Add to existing PlansRepository class:

/**
 * Find all active plans for public display
 */
async findAllActivePlans(
  query?: ListPublicPlansDto,
): Promise<PaginatedResponseDto<PlanDto>> {
  const plans = await this.planModel.findAll({
    where: { isActive: true },
    order: [
      ['isFreemium', 'DESC'],  // Freemium first
      ['price', 'ASC'],        // Then by price
    ],
  });

  const dtoItems = this.toDTOList(plans);
  return new PaginatedResponseDto<PlanDto>(dtoItems, dtoItems.length, 1, 100);
}

/**
 * Find active plan by ID
 */
async findActiveById(id: string): Promise<PlanDto | null> {
  const plan = await this.planModel.findOne({
    where: { id, isActive: true },
  });
  return this.toDTO(plan);
}

/**
 * Find the freemium plan
 */
async findFreemiumPlan(): Promise<PlanDto | null> {
  const plan = await this.planModel.findOne({
    where: { isFreemium: true, isActive: true },
  });
  return this.toDTO(plan);
}
```

### 1.6 Subscription Expiry Processor Enhancement

```typescript
// be/src/modules/subscriptions/services/subscriptions.service.ts

// Modify processExpiredSubscriptions method:

async processExpiredSubscriptions(): Promise<void> {
  this.logger.log('Starting subscription expiry check...');

  try {
    const expiredSubscriptions =
      await this.subscriptionsRepository.findExpiredSubscriptions();

    this.logger.log(
      `Found ${expiredSubscriptions.length} expired subscriptions`,
    );

    for (const subscription of expiredSubscriptions) {
      const transaction = await this.sequelize.transaction();

      try {
        // Get the plan to check if freemium
        const plan = await this.plansService.findById(
          subscription.planId,
          undefined,
          transaction,
        );

        if (plan.isFreemium) {
          // Auto-renew freemium subscription
          const newEndDate = this.calculateEndDate(new Date(), plan.period);
          
          await this.subscriptionsRepository.update(
            subscription.id,
            {
              startDate: new Date(),
              endDate: newEndDate,
              status: SubscriptionStatus.ACTIVE,
              isActive: true,
            },
            transaction,
          );

          this.logger.log(
            `Auto-renewed freemium subscription ${subscription.id} until ${newEndDate.toISOString()}`,
          );
        } else {
          // Mark as expired for paid plans
          await this.subscriptionsRepository.updateStatus(
            subscription.id,
            SubscriptionStatus.EXPIRED,
            transaction,
          );

          // Deactivate tenant
          await this.tenantsService.deactivate(subscription.tenantId);

          this.logger.log(
            `Expired subscription ${subscription.id} and deactivated tenant ${subscription.tenantId}`,
          );
        }

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        this.logger.error(
          `Failed to process subscription ${subscription.id}`,
          error,
        );
      }
    }

    this.logger.log('Subscription expiry check completed');
  } catch (error) {
    this.logger.error('Error during subscription expiry check', error);
  }
}
```

### 1.7 Registration API

#### Register DTO
```typescript
// be/src/modules/auth/dtos/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // Business/Tenant Information
  @ApiProperty({ description: 'Business name (slug auto-generated)', example: 'My Store' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  businessName: string;

  @ApiProperty({ description: 'Contact phone with country code', example: '+201234567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  contactPhone: string;

  @ApiProperty({ description: 'Secondary contact phone', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  secondaryContactPhone?: string;

  // Admin User Information
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ description: 'Username', example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ description: 'Password', example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
```

#### Register Response DTO
```typescript
// be/src/modules/auth/dtos/register-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TenantDto } from 'src/modules/tenants/dtos/tenant.dto';
import { UserDto } from 'src/modules/users/dtos/user.dto';

export class RegisterResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ description: 'Token expiry in seconds' })
  expiresIn: number;

  @ApiProperty({ description: 'Created user', type: () => UserDto })
  user: UserDto;

  @ApiProperty({ description: 'Created tenant', type: () => TenantDto })
  tenant: TenantDto;
}
```

#### Auth Controller Enhancement
```typescript
// be/src/modules/auth/controllers/auth.controller.ts

// Add to existing AuthController:

@Public()
@Post('register')
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Register new user with tenant (freemium)' })
@ApiResponse({
  status: 201,
  description: 'User and tenant created successfully',
  type: RegisterResponseDto,
})
@ApiResponse({
  status: 400,
  description: 'Validation error or subdomain already taken',
})
@ApiResponse({
  status: 409,
  description: 'Username or email already exists',
})
async register(
  @Body() registerDto: RegisterDto,
  @Req() req: Request,
): Promise<ApiResponseInterface<RegisterResponseDto>> {
  const result = await this.authService.register(registerDto, {
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });
  
  return this.transformer.transform(result);
}
```

#### Auth Service Enhancement
```typescript
// be/src/modules/auth/services/auth.service.ts

// Add to existing AuthService:

async register(
  registerDto: RegisterDto,
  requestInfo?: { ipAddress?: string; userAgent?: string },
): Promise<RegisterResponseDto> {
  // 1. Fetch freemium plan
  const freemiumPlan = await this.plansService.findFreemiumPlan();
  if (!freemiumPlan) {
    throw new ApiException(
      'auth.errors.no_freemium_plan_available',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  // 2. Check if username exists (globally for system users, or within tenants)
  const existingUser = await this.usersService.findUserByEmailOrUsername(
    registerDto.email || registerDto.username,
  );
  if (existingUser) {
    throw new ApiException(
      'auth.errors.user_already_exists',
      HttpStatus.CONFLICT,
    );
  }

  // 3. Generate unique slug from business name
  const slug = await this.generateUniqueSlug(registerDto.businessName);

  // 4. Delegate to tenant service for creation
  const createTenantDto: CreateTenantDto = {
    name: registerDto.businessName,
    slug: slug, // Auto-generated slug
    contactPhone: registerDto.contactPhone,
    secondaryContactPhone: registerDto.secondaryContactPhone,
    planId: freemiumPlan.id,
    adminUser: {
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    },
  };

  const tenantResult = await this.tenantsService.create(createTenantDto);

  // 5. Generate tokens for the new admin user
  const adminUser = await this.usersService.findUserByUsernameAndTenantId(
    registerDto.username,
    tenantResult.id,
    { getRole: true },
  );

  if (!adminUser) {
    throw new ApiException(
      'auth.errors.registration_failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  const payload = this.buildTokenPayload(adminUser);
  const accessToken = this.signToken(payload);
  const expiresIn = this.getAccessTokenExpiryTime();

  const refreshToken = await this.refreshTokenRepository.createRefreshToken({
    userId: adminUser.id,
    expiresIn: this.configService.get<number>('jwt.refreshExpiresIn') || 604800,
    ipAddress: requestInfo?.ipAddress,
    userAgent: requestInfo?.userAgent,
    tenantId: tenantResult.id,
  });

  // Remove password hash from response
  delete adminUser.passwordHash;

  return {
    accessToken,
    refreshToken: refreshToken.token,
    expiresIn,
    user: adminUser,
    tenant: tenantResult,
  };
}

/**
 * Generate unique slug from business name
 * Format: "my-store-4829"
 */
private async generateUniqueSlug(businessName: string): Promise<string> {
  const baseSlug = businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Multiple hyphens to single
    .substring(0, 50);             // Limit length

  let slug = baseSlug;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const suffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    slug = `${baseSlug}-${suffix}`;
    
    const existing = await this.tenantsService.findBySlug(slug);
    if (!existing) {
      return slug;
    }
    attempts++;
  }

  // Fallback with timestamp if all attempts fail
  return `${baseSlug}-${Date.now()}`;
}
```

---

## 1.8 Contact Module (NEW)

### Overview
The Contact module handles contact form submissions from the landing page. It stores inquiries in the database and can optionally send email notifications.

### Contact Model
```typescript
// be/src/modules/contact/models/contact-inquiry.model.ts
import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseEntity } from '../../../core/models/base.entity';

export enum InquiryStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum InquiryType {
  GENERAL = 'GENERAL',
  DEMO = 'DEMO',
  SUPPORT = 'SUPPORT',
  SALES = 'SALES',
  PARTNERSHIP = 'PARTNERSHIP',
}

interface ContactInquiryAttributes {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: InquiryType;
  status: InquiryStatus;
  ipAddress: string | null;
  userAgent: string | null;
  locale: string | null;
  notes: string | null;
  resolvedAt: Date | null;
  resolvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ContactInquiryCreationAttributes {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: InquiryType;
  status?: InquiryStatus;
  ipAddress?: string;
  userAgent?: string;
  locale?: string;
}

@Table({
  tableName: 'contact_inquiries',
  timestamps: true,
})
export class ContactInquiry extends BaseEntity<
  ContactInquiryAttributes,
  ContactInquiryCreationAttributes
> {
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  phone: string | null;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  subject: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: InquiryType.GENERAL,
  })
  type: InquiryType;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: InquiryStatus.NEW,
  })
  status: InquiryStatus;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
  })
  ipAddress: string | null;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  userAgent: string | null;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  locale: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  resolvedAt: Date | null;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  resolvedBy: string | null;
}
```

### Contact DTOs

#### Create Contact Inquiry DTO (Public)
```typescript
// be/src/modules/contact/dtos/create-contact-inquiry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { InquiryType } from '../models/contact-inquiry.model';

export class CreateContactInquiryDto {
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ description: 'Subject', example: 'Product inquiry' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message: string;

  @ApiProperty({
    description: 'Inquiry type',
    enum: InquiryType,
    default: InquiryType.GENERAL,
    required: false,
  })
  @IsEnum(InquiryType)
  @IsOptional()
  type?: InquiryType;

  @ApiProperty({ description: 'Locale/language', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  locale?: string;

  // Set by controller, not from client
  ipAddress?: string;
  userAgent?: string;
}
```

#### Contact Inquiry DTO (Response)
```typescript
// be/src/modules/contact/dtos/contact-inquiry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { InquiryStatus, InquiryType } from '../models/contact-inquiry.model';

export class ContactInquiryDto {
  @ApiProperty({ description: 'Inquiry ID' })
  id: string;

  @ApiProperty({ description: 'Submitter name' })
  name: string;

  @ApiProperty({ description: 'Submitter email' })
  email: string;

  @ApiProperty({ description: 'Submitter phone', nullable: true })
  phone: string | null;

  @ApiProperty({ description: 'Subject' })
  subject: string;

  @ApiProperty({ description: 'Message' })
  message: string;

  @ApiProperty({ description: 'Inquiry type', enum: InquiryType })
  type: InquiryType;

  @ApiProperty({ description: 'Inquiry status', enum: InquiryStatus })
  status: InquiryStatus;

  @ApiProperty({ description: 'Submitter locale', nullable: true })
  locale: string | null;

  @ApiProperty({ description: 'Admin notes', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Resolution date', nullable: true })
  resolvedAt: Date | null;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
```

#### List Contact Inquiries DTO (Admin)
```typescript
// be/src/modules/contact/dtos/list-contact-inquiries.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../core/dtos/pagination.dto';
import { InquiryStatus, InquiryType } from '../models/contact-inquiry.model';

export class ListContactInquiriesDto extends PaginationDto {
  @ApiProperty({ description: 'Filter by status', enum: InquiryStatus, required: false })
  @IsEnum(InquiryStatus)
  @IsOptional()
  status?: InquiryStatus;

  @ApiProperty({ description: 'Filter by type', enum: InquiryType, required: false })
  @IsEnum(InquiryType)
  @IsOptional()
  type?: InquiryType;

  @ApiProperty({ description: 'Search by name or email', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
```

#### Update Contact Inquiry DTO (Admin)
```typescript
// be/src/modules/contact/dtos/update-contact-inquiry.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { InquiryStatus } from '../models/contact-inquiry.model';

export class UpdateContactInquiryDto {
  @ApiProperty({ description: 'Status', enum: InquiryStatus, required: false })
  @IsEnum(InquiryStatus)
  @IsOptional()
  status?: InquiryStatus;

  @ApiProperty({ description: 'Admin notes', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  notes?: string;
}
```

### Public Contact Controller
```typescript
// be/src/modules/contact/controllers/public.contact.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../auth/decorators/public.decorator';
import { ApiResponse, ResponseTransformer } from '../../../core';
import { CreateContactInquiryDto } from '../dtos/create-contact-inquiry.dto';
import { ContactService } from '../services/contact.service';

@Controller({ version: '1', path: 'public/contact' })
@ApiTags('Public Contact')
export class PublicContactController {
  constructor(
    private readonly transformer: ResponseTransformer,
    private readonly contactService: ContactService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit contact form (public)' })
  async submit(
    @Body() createDto: CreateContactInquiryDto,
    @Req() req: Request,
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    // Add request metadata
    createDto.ipAddress = req.ip;
    createDto.userAgent = req.headers['user-agent'];

    await this.contactService.create(createDto);

    return this.transformer.transform({
      success: true,
      message: 'contact.success.submitted',
    });
  }
}
```

### System Contact Controller (Admin)
```typescript
// be/src/modules/contact/controllers/system.contact.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PERMISSIONS } from '../../auth/constants/permissions';
import { CurrentUserId } from '../../auth/decorators/current-user.decorator';
import { ApiResponse, ResponseTransformer } from '../../../core';
import { PaginatedResponseDto } from '../../../core/dtos/pagination.dto';
import { JwtAuthGuard } from '../../auth/strategies/jwt.strategy';
import { PermissionsGuard, RequirePermission } from '../../users/guards/permissions.guard';
import { ContactInquiryDto } from '../dtos/contact-inquiry.dto';
import { ListContactInquiriesDto } from '../dtos/list-contact-inquiries.dto';
import { UpdateContactInquiryDto } from '../dtos/update-contact-inquiry.dto';
import { ContactService } from '../services/contact.service';

@Controller({ version: '1', path: 'system/contact' })
@ApiTags('Contact Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SystemContactController {
  constructor(
    private readonly transformer: ResponseTransformer,
    private readonly contactService: ContactService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all contact inquiries' })
  @RequirePermission(PERMISSIONS.CONTACT_VIEW)
  async findAll(
    @Query() query: ListContactInquiriesDto,
  ): Promise<ApiResponse<PaginatedResponseDto<ContactInquiryDto>>> {
    const inquiries = await this.contactService.findAll(query);
    return this.transformer.transform(inquiries);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact inquiry by ID' })
  @RequirePermission(PERMISSIONS.CONTACT_VIEW)
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiResponse<ContactInquiryDto>> {
    const inquiry = await this.contactService.findById(id);
    return this.transformer.transform(inquiry);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact inquiry (status, notes)' })
  @RequirePermission(PERMISSIONS.CONTACT_EDIT)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateContactInquiryDto,
    @CurrentUserId() userId: string,
  ): Promise<ApiResponse<ContactInquiryDto>> {
    const inquiry = await this.contactService.update(id, updateDto, userId);
    return this.transformer.transform(inquiry);
  }
}
```

### Contact Service
```typescript
// be/src/modules/contact/services/contact.service.ts
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PaginatedResponseDto } from '../../../core/dtos/pagination.dto';
import { ApiException } from '../../../core/exceptions/api.exception';
import { ContactInquiryDto } from '../dtos/contact-inquiry.dto';
import { CreateContactInquiryDto } from '../dtos/create-contact-inquiry.dto';
import { ListContactInquiriesDto } from '../dtos/list-contact-inquiries.dto';
import { UpdateContactInquiryDto } from '../dtos/update-contact-inquiry.dto';
import { InquiryStatus } from '../models/contact-inquiry.model';
import { ContactRepository } from '../repositories/contact.repository';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly contactRepository: ContactRepository) {}

  async create(createDto: CreateContactInquiryDto): Promise<ContactInquiryDto> {
    const inquiry = await this.contactRepository.create({
      name: createDto.name,
      email: createDto.email,
      phone: createDto.phone,
      subject: createDto.subject,
      message: createDto.message,
      type: createDto.type,
      ipAddress: createDto.ipAddress,
      userAgent: createDto.userAgent,
      locale: createDto.locale,
    });

    this.logger.log(`Contact inquiry created: ${inquiry.id} from ${createDto.email}`);

    // TODO: Optionally send email notification to admin
    // await this.emailService.sendContactNotification(inquiry);

    return inquiry;
  }

  async findAll(
    query?: ListContactInquiriesDto,
  ): Promise<PaginatedResponseDto<ContactInquiryDto>> {
    return this.contactRepository.findAllPaginated(query);
  }

  async findById(id: string): Promise<ContactInquiryDto> {
    const inquiry = await this.contactRepository.findById(id);
    if (!inquiry) {
      throw new ApiException(
        'contact.errors.inquiry_not_found',
        HttpStatus.NOT_FOUND,
      );
    }
    return inquiry;
  }

  async update(
    id: string,
    updateDto: UpdateContactInquiryDto,
    userId: string,
  ): Promise<ContactInquiryDto> {
    const inquiry = await this.findById(id);

    const updateData: Partial<ContactInquiryDto> & {
      resolvedAt?: Date;
      resolvedBy?: string;
    } = {};

    if (updateDto.status) {
      updateData.status = updateDto.status;

      // If marking as resolved, set resolution metadata
      if (updateDto.status === InquiryStatus.RESOLVED) {
        updateData.resolvedAt = new Date();
        updateData.resolvedBy = userId;
      }
    }

    if (updateDto.notes !== undefined) {
      updateData.notes = updateDto.notes;
    }

    await this.contactRepository.update(id, updateData);

    return this.findById(id);
  }
}
```

### Contact Repository
```typescript
// be/src/modules/contact/repositories/contact.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { PaginatedResponseDto } from '../../../core/dtos/pagination.dto';
import { Repository } from '../../../core/repositories/base.repository';
import { ContactInquiryDto } from '../dtos/contact-inquiry.dto';
import { ListContactInquiriesDto } from '../dtos/list-contact-inquiries.dto';
import { ContactInquiry } from '../models/contact-inquiry.model';

@Injectable()
export class ContactRepository extends Repository<ContactInquiry, ContactInquiryDto> {
  constructor(
    @InjectModel(ContactInquiry)
    private readonly contactModel: typeof ContactInquiry,
  ) {
    super(contactModel);
  }

  async findAllPaginated(
    query?: ListContactInquiriesDto,
  ): Promise<PaginatedResponseDto<ContactInquiryDto>> {
    const where: WhereOptions = {};
    const page = query?.page || 1;
    const pageSize = query?.pageSize || 20;

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.type) {
      where.type = query.type;
    }

    if (query?.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { email: { [Op.iLike]: `%${query.search}%` } },
        { subject: { [Op.iLike]: `%${query.search}%` } },
      ];
    }

    const { rows, count } = await this.contactModel.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return new PaginatedResponseDto<ContactInquiryDto>(
      this.toDTOList(rows),
      count,
      page,
      pageSize,
    );
  }
}
```

### Contact Module
```typescript
// be/src/modules/contact/contact.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResponseTransformer } from '../../core';
import { AuthModule } from '../auth/auth.module';
import { PublicContactController } from './controllers/public.contact.controller';
import { SystemContactController } from './controllers/system.contact.controller';
import { ContactInquiry } from './models/contact-inquiry.model';
import { ContactRepository } from './repositories/contact.repository';
import { ContactService } from './services/contact.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ContactInquiry]),
    AuthModule,
  ],
  controllers: [PublicContactController, SystemContactController],
  providers: [ResponseTransformer, ContactRepository, ContactService],
  exports: [ContactService],
})
export class ContactModule {}
```

### Permissions Update
```typescript
// Add to be/src/modules/auth/constants/permissions.ts

// In PermissionResource enum:
CONTACT = 'contact',

// In PERMISSIONS object:
CONTACT_VIEW: `${PermissionAction.VIEW}:${PermissionResource.CONTACT}`,
CONTACT_EDIT: `${PermissionAction.EDIT}:${PermissionResource.CONTACT}`,

// In SYSTEM_PERMISSIONS array:
PERMISSIONS.CONTACT_VIEW,
PERMISSIONS.CONTACT_EDIT,
```

---

## 2. Frontend Implementation

### 2.1 Environment Configuration

#### Environment Variables
```bash
# my-app/.env.local (example)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_PORTAL_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
# NEXT_PUBLIC_API_URL=https://console.cash-vio.com/api/v1
# NEXT_PUBLIC_PORTAL_URL=https://console.cash-vio.com
# NEXT_PUBLIC_SITE_URL=https://cash-vio.com

# Optional
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=EG
```

#### Environment Config File
```typescript
// my-app/src/config/env.ts

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value && typeof window === 'undefined') {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || '';
};

export const env = {
  // API Configuration
  api: {
    baseUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api/v1'),
    timeout: parseInt(getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '30000'), 10),
  },

  // Site URLs
  site: {
    url: getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://cashvio.com'),
  },

  // External Links
  links: {
    portal: getEnvVar('NEXT_PUBLIC_PORTAL_URL', 'https://portal.cashvio.com'),
    get login() {
      return `${this.portal}/login`;
    },
    get register() {
      return `${this.portal}/register`;
    },
    support: getEnvVar('NEXT_PUBLIC_SUPPORT_URL', 'https://support.cashvio.com'),
  },

  // Defaults
  defaults: {
    countryCode: getEnvVar('NEXT_PUBLIC_DEFAULT_COUNTRY_CODE', 'EG'),
  },
} as const;

export type EnvConfig = typeof env;
```

### 2.2 HTTP Module

#### Types
```typescript
// my-app/src/lib/http/types.ts

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  signal?: AbortSignal;
}

export interface HttpError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
```

#### HTTP Client
```typescript
// my-app/src/lib/http/client.ts

import { env } from '@/config/env';
import type { ApiResponse, RequestConfig, HttpError, HttpMethod } from './types';

class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = env.api.baseUrl;
    this.defaultTimeout = env.api.timeout;
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add query params
    if (config?.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config?.timeout || this.defaultTimeout,
    );

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: config?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json();

      if (!response.ok) {
        const error: HttpError = {
          status: response.status,
          message: json.message || 'An error occurred',
          errors: json.errors,
          code: json.code,
        };
        throw error;
      }

      return json as ApiResponse<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw { status: 408, message: 'Request timeout' } as HttpError;
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

export const httpClient = new HttpClient();
```

#### Plans Service
```typescript
// my-app/src/lib/http/services/plans.service.ts

import { httpClient } from '../client';
import type { ApiResponse, PaginatedResponse } from '../types';
import type { Plan } from '@/types';

export interface PublicPlan {
  id: string;
  arName: string;
  enName: string;
  detailsAr: string[];
  detailsEn: string[];
  price: number;
  period: string;
  isFreemium: boolean;
}

export const plansService = {
  /**
   * Get all active plans (public)
   */
  async getPlans(): Promise<ApiResponse<PaginatedResponse<PublicPlan>>> {
    return httpClient.get<PaginatedResponse<PublicPlan>>('/public/plans');
  },

  /**
   * Get plan by ID (public)
   */
  async getPlanById(id: string): Promise<ApiResponse<PublicPlan>> {
    return httpClient.get<PublicPlan>(`/public/plans/${id}`);
  },
};
```

#### Auth Service
```typescript
// my-app/src/lib/http/services/auth.service.ts

import { httpClient } from '../client';
import type { ApiResponse } from '../types';

export interface RegisterRequest {
  businessName: string;
  contactPhone: string;
  secondaryContactPhone?: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string | null;
  };
  tenant: {
    id: string;
    name: string;
    slug: string; // Auto-generated
  };
}

export const authService = {
  /**
   * Register new user with tenant
   */
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return httpClient.post<RegisterResponse>('/auth/register', data);
  },
};
```

#### Contact Service
```typescript
// my-app/src/lib/http/services/contact.service.ts

import { httpClient } from '../client';
import type { ApiResponse } from '../types';

export type InquiryType = 'GENERAL' | 'DEMO' | 'SUPPORT' | 'SALES' | 'PARTNERSHIP';

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type?: InquiryType;
  locale?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Submit contact form
   */
  async submit(data: ContactRequest): Promise<ApiResponse<ContactResponse>> {
    return httpClient.post<ContactResponse>('/public/contact', data);
  },
};
```

### 2.3 Phone Input Component

```typescript
// my-app/src/components/ui/phone-input.tsx
'use client';

import { forwardRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { env } from '@/config/env';

// Country data (subset - expand as needed)
const countries = [
  { code: 'EG', dialCode: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  // Add more countries as needed
] as const;

type Country = typeof countries[number];

export interface PhoneInputProps {
  value?: string;
  onChange?: (fullNumber: string, countryCode: string, nationalNumber: string) => void;
  defaultCountry?: string;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  id?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value = '',
      onChange,
      defaultCountry = env.defaults.countryCode,
      error,
      disabled,
      placeholder = 'Phone number',
      className,
      name,
      id,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(
      countries.find((c) => c.code === defaultCountry) || countries[0],
    );
    const [nationalNumber, setNationalNumber] = useState(
      value.replace(selectedCountry.dialCode, ''),
    );

    const handleCountrySelect = useCallback(
      (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        const fullNumber = `${country.dialCode}${nationalNumber}`;
        onChange?.(fullNumber, country.code, nationalNumber);
      },
      [nationalNumber, onChange],
    );

    const handleNumberChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = e.target.value.replace(/[^0-9]/g, '');
        setNationalNumber(newNumber);
        const fullNumber = `${selectedCountry.dialCode}${newNumber}`;
        onChange?.(fullNumber, selectedCountry.code, newNumber);
      },
      [selectedCountry, onChange],
    );

  return (
      <div className={cn('relative flex', className)}>
        {/* Country Selector */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-l-lg border border-r-0 bg-muted/50',
            'text-sm font-medium transition-colors',
            error ? 'border-destructive' : 'border-border',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'hover:bg-muted',
          )}
        >
          <span>{selectedCountry.flag}</span>
          <span className="text-muted-foreground">{selectedCountry.dialCode}</span>
          <svg
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform',
              isOpen && 'rotate-180',
            )}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1 z-50 w-64 max-h-60 overflow-auto rounded-lg border border-border bg-card shadow-lg">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 text-sm text-left',
                    'hover:bg-muted transition-colors',
                    country.code === selectedCountry.code && 'bg-primary/10',
                  )}
                >
                  <span>{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-muted-foreground">{country.dialCode}</span>
                </button>
              ))}
      </div>
    </>
        )}

        {/* Phone Number Input */}
        <input
          ref={ref}
          type="tel"
          id={id}
          name={name}
          value={nationalNumber}
          onChange={handleNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 h-10 rounded-r-lg border bg-background px-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-border',
          )}
        />
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
```

### 2.4 Contact Form Component

```typescript
// my-app/src/components/forms/contact-form.tsx
'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { contactService, type InquiryType } from '@/lib/http/services/contact.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

interface ContactFormProps {
  className?: string;
  defaultType?: InquiryType;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm({ className, defaultType = 'GENERAL' }: ContactFormProps) {
  const t = useTranslations('contact.form');
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('errors.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('errors.messageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validate()) return;

      setIsSubmitting(true);
      setSubmitStatus('idle');
      setErrorMessage('');

      try {
        await contactService.submit({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message,
          type: defaultType,
          locale,
        });

        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } catch (error) {
        setSubmitStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : t('errors.submitFailed'),
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, defaultType, locale, validate, t],
  );

  if (submitStatus === 'success') {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {t('success.title')}
        </h3>
        <p className="text-muted-foreground">{t('success.message')}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setSubmitStatus('idle')}
        >
          {t('success.sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {submitStatus === 'error' && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            {t('name')} *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('namePlaceholder')}
            error={!!errors.name}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            {t('email')} *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            error={!!errors.email}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
          {t('phone')}
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t('phonePlaceholder')}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
          {t('subject')} *
        </label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={t('subjectPlaceholder')}
          error={!!errors.subject}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-destructive">{errors.subject}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          {t('message')} *
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          error={!!errors.message}
          disabled={isSubmitting}
          rows={5}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-destructive">{errors.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
```

---

## 3. Database Schema Changes

### Migration 1: Plan Schema Changes
```typescript
// be/src/database/migrations/YYYYMMDDHHMMSS-add-plan-details-and-freemium.ts

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add detailsAr column
  await queryInterface.addColumn('plans', 'detailsAr', {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
  });

  // Add detailsEn column
  await queryInterface.addColumn('plans', 'detailsEn', {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: [],
  });

  // Add isFreemium column
  await queryInterface.addColumn('plans', 'isFreemium', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });

  // Add partial unique index to ensure only one freemium plan
  await queryInterface.sequelize.query(`
    CREATE UNIQUE INDEX "plans_is_freemium_unique" 
    ON "plans" ("isFreemium") 
    WHERE "isFreemium" = true;
  `);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.sequelize.query(`
    DROP INDEX IF EXISTS "plans_is_freemium_unique";
  `);
  await queryInterface.removeColumn('plans', 'isFreemium');
  await queryInterface.removeColumn('plans', 'detailsEn');
  await queryInterface.removeColumn('plans', 'detailsAr');
}
```

### Migration 2: Contact Inquiries Table
```typescript
// be/src/database/migrations/YYYYMMDDHHMMSS-create-contact-inquiries.ts

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('contact_inquiries', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'GENERAL',
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'NEW',
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    locale: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resolvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes
  await queryInterface.addIndex('contact_inquiries', ['status']);
  await queryInterface.addIndex('contact_inquiries', ['type']);
  await queryInterface.addIndex('contact_inquiries', ['email']);
  await queryInterface.addIndex('contact_inquiries', ['createdAt']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('contact_inquiries');
}
```

---

## 4. API Specifications

### Public Plans API

#### GET /api/v1/public/plans

**Request:**
```http
GET /api/v1/public/plans HTTP/1.1
Accept: application/json
```

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "arName": "الخطة المجانية",
        "enName": "Free Plan",
        "detailsAr": ["ميزة 1", "ميزة 2"],
        "detailsEn": ["Feature 1", "Feature 2"],
        "price": 0,
        "period": "MONTH",
        "isFreemium": true
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 100
  },
  "success": true
}
```

### Registration API

#### POST /api/v1/auth/register

**Request:**
```json
{
  "businessName": "My Store",
  "contactPhone": "+201234567890",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

**Success Response (201):**
```json
{
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_uuid",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "tenant": {
      "id": "uuid",
      "name": "My Store",
      "slug": "my-store-4829"
    }
  },
  "success": true
}
```

**Error Response (409 - Conflict):**
```json
{
  "success": false,
  "message": "auth.errors.user_already_exists",
  "statusCode": 409
}
```

### Contact API

#### POST /api/v1/public/contact

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+201234567890",
  "subject": "Product Inquiry",
  "message": "I would like to learn more about your pricing plans.",
  "type": "SALES",
  "locale": "en"
}
```

**Success Response (201):**
```json
{
  "data": {
    "success": true,
    "message": "contact.success.submitted"
  },
  "success": true
}
```

**Error Response (400 - Validation):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Invalid email format"],
    "message": ["Message is required"]
  },
  "statusCode": 400
}
```

### Contact Management API (Admin)

#### GET /api/v1/system/contact

**Request:**
```http
GET /api/v1/system/contact?status=NEW&page=1&pageSize=20 HTTP/1.1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+201234567890",
        "subject": "Product Inquiry",
        "message": "...",
        "type": "SALES",
        "status": "NEW",
        "locale": "en",
        "notes": null,
        "resolvedAt": null,
        "createdAt": "2026-01-03T10:00:00.000Z",
        "updatedAt": "2026-01-03T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "success": true
}
```

#### PATCH /api/v1/system/contact/:id

**Request:**
```json
{
  "status": "RESOLVED",
  "notes": "Responded via email on 2026-01-03"
}
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "RESOLVED",
    "notes": "Responded via email on 2026-01-03",
    "resolvedAt": "2026-01-03T11:00:00.000Z",
    "resolvedBy": "admin-user-uuid"
  },
  "success": true
}
```
