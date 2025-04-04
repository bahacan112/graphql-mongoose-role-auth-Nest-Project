import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PackageService } from './package.service';
import { Package } from 'src/schemas/package.schema';
import { CreatePackageInput } from '../dto/create-package.input';

@Resolver(() => Package)
export class PackageResolver {
  constructor(private readonly service: PackageService) {}

  @Query(() => [Package])
  async packages(): Promise<Package[]> {
    return this.service.findAll();
  }

  @Query(() => Package, { nullable: true })
  async package(@Args('id') id: string): Promise<Package | null> {
    return this.service.findOne(id);
  }

  @Mutation(() => Package)
  async createPackage(
    @Args('input') input: CreatePackageInput,
  ): Promise<Package> {
    return this.service.create(input);
  }

  @Mutation(() => Boolean)
  async deletePackage(@Args('id') id: string): Promise<boolean> {
    return this.service.remove(id);
  }

  @Mutation(() => Package)
  async updatePackage(
    @Args('id') id: string,
    @Args('input') input: CreatePackageInput,
  ): Promise<Package> {
    return this.service.update(id, input);
  }
}
