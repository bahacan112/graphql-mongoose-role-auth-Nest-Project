// src/shared/shared-data.resolver.ts
import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { UploadedRecord } from 'src/schemas/uploaded-record.schema';
import { Guide } from 'src/schemas/guide.schema';
import { GuideSale } from 'src/schemas/guide-sale.schema';
import { Package } from 'src/schemas/package.schema';
import { GuideTourAssignment } from 'src/schemas/guide-tour.schema';
import { SharedDataService } from './shared-data.service';
import { ReservationFilterInput } from './dto/reservation-filter.input';
import { GuideSaleWithGuideName } from './graphql/all-data.output';
@Resolver(() => UploadedRecord)
export class SharedDataResolver {
  constructor(private readonly sharedDataService: SharedDataService) {}

  @Query(() => [UploadedRecord])
  async getAllData() {
    return this.sharedDataService.getAllData();
  }

  @Query(() => [Guide])
  async getAllGuides() {
    return this.sharedDataService.getAllGuides();
  }

  @Query(() => [Package])
  async getAllPackages() {
    return this.sharedDataService.getAllPackages();
  }

  @Query(() => [GuideTourAssignment])
  async getAllAssignments() {
    return this.sharedDataService.getAllAssignments();
  }

  @Query(() => [UploadedRecord])
  async getReservationsWithGuideInfo() {
    return this.sharedDataService.getReservationsWithGuideInfo();
  }

  @Query(() => [UploadedRecord])
  async getFilteredReservations(
    @Args('filter', { type: () => ReservationFilterInput })
    filter: ReservationFilterInput,
  ) {
    return this.sharedDataService.getFilteredReservations(filter);
  }

  @Query(() => [GuideSaleWithGuideName])
  filteredGuideSales(
    @Args('filter') filter: ReservationFilterInput,
  ): Promise<GuideSaleWithGuideName[]> {
    return this.sharedDataService.getFilteredGuideSales(filter);
  }

  @ResolveField(() => Guide, { nullable: true })
  async assignedGuide(@Parent() record: UploadedRecord) {
    return this.sharedDataService.getAssignedGuide(record);
  }
  @ResolveField(() => [GuideSale], { name: 'guideSales' })
  async getGuideSales(@Parent() record: UploadedRecord) {
    return this.sharedDataService.getSalesByCombinedVoucher(
      record.combinedVoucher,
    );
  }
}
