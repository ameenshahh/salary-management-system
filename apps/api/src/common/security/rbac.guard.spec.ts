import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { RbacGuard } from './rbac.guard';

describe('RbacGuard', () => {
  let guard: RbacGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RbacGuard, Reflector],
    }).compile();
    guard = module.get(RbacGuard);
    reflector = module.get(Reflector);
  });

  function mockContext(user?: { permissions: string[] }): ExecutionContext {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as ExecutionContext;
  }

  it('allows when no permissions required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    expect(guard.canActivate(mockContext())).toBe(true);
  });

  it('denies when user lacks permission', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['employees:write']);
    expect(() => guard.canActivate(mockContext({ permissions: ['employees:read'] }))).toThrow(
      ForbiddenException,
    );
  });

  it('allows when user has required permission', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['employees:read']);
    expect(guard.canActivate(mockContext({ permissions: ['employees:read'] }))).toBe(true);
  });
});
