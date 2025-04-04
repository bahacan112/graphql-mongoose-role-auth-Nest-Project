// src/shared/shared-data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadedRecord } from 'src/schemas/uploaded-record.schema';
import { Guide } from 'src/schemas/guide.schema';
import { Package } from 'src/schemas/package.schema';
import { GuideTourAssignment } from 'src/schemas/guide-tour.schema';
import { ReservationFilterInput } from './dto/reservation-filter.input';
import { GuideSale } from 'src/schemas/guide-sale.schema'; // yeni import
@Injectable()
export class SharedDataService {
  constructor(
    @InjectModel(UploadedRecord.name)
    private readonly uploadedRecordModel: Model<UploadedRecord>,

    @InjectModel(Guide.name)
    private readonly guideModel: Model<Guide>,

    @InjectModel(Package.name)
    private readonly packageModel: Model<Package>,
    @InjectModel(GuideSale.name)
    private readonly guideSaleModel: Model<GuideSale>,

    @InjectModel(GuideTourAssignment.name)
    private readonly guideAssignmentModel: Model<GuideTourAssignment>,
  ) {}

  async getAllData() {
    return this.uploadedRecordModel.find().lean();
  }

  async getAllGuides() {
    return this.guideModel.find().lean();
  }

  async getAllPackages() {
    return this.packageModel.find().lean();
  }

  async getAllAssignments() {
    return this.guideAssignmentModel.find().lean();
  }

  async getReservationsWithGuideInfo() {
    const reservations = await this.uploadedRecordModel.find().lean();
    const assignments = await this.guideAssignmentModel.find().lean();
    const guides = await this.guideModel.find().lean();
    const sales = await this.guideSaleModel.find().lean(); // satışları da al

    return reservations.map((res) => {
      const { grup1, grup2, grup5 } = res.groupCodes || {};
      const match = assignments.find(
        (a) => a.grup1 === grup1 && a.grup2 === grup2 && a.grup5 === grup5,
      );

      if (match) {
        const guide = guides.find((g) => g._id.toString() === match.guideId);
        return {
          ...res,
          assignedGuide: guide || null,
        };
      }
      const relatedSales = sales.filter(
        (s) => s.combinedVoucher === res.combinedVoucher,
      );

      return {
        ...res,
        assignedGuide: null,
        sales: relatedSales,
      };
    });
  }

  async getFilteredGuideSales(filter: ReservationFilterInput) {
    const query: any = {};

    if (filter.checkInDate && filter.checkInDateTo) {
      query.saleDate = {
        $gte: new Date(filter.checkInDate),
        $lte: new Date(filter.checkInDateTo),
      };
    }

    if (filter.combinedVoucher)
      query.combinedVoucher = { $regex: filter.combinedVoucher, $options: 'i' };

    if (filter.packageName)
      query.packageName = { $regex: filter.packageName, $options: 'i' };

    if (filter.adSoyad) {
      const matchedGuides = await this.guideModel
        .find({ adSoyad: { $regex: filter.adSoyad, $options: 'i' } })
        .lean();
      const guideIds = matchedGuides.map((g) => g._id.toString());
      query.guideId = { $in: guideIds };
    }

    const sales = await this.guideSaleModel.find(query).lean();
    const guides = await this.guideModel.find().lean();

    return sales.map((s) => ({
      ...s,
      saleDate: s.saleDate?.toISOString(), // ✅ burada dönüşüm yapılıyor

      guideName:
        guides.find((g) => g._id.toString() === s.guideId)?.adSoyad ?? '',
    }));
  }
  async getAssignedGuide(record: any) {
    const { grup1, grup2, grup5 } = record.groupCodes || {};
    const match = await this.guideAssignmentModel
      .findOne({ grup1, grup2, grup5 })
      .lean();
    if (!match) return null;

    return this.guideModel.findById(match.guideId).lean();
  }
  async getFilteredReservations(filter: ReservationFilterInput) {
    const query: any = {};
    console.log('sorgu çalıştı');
    if (filter.grup1)
      query['groupCodes.grup1'] = { $regex: filter.grup1, $options: 'i' };
    if (filter.grup2)
      query['groupCodes.grup2'] = { $regex: filter.grup2, $options: 'i' };
    if (filter.grup5)
      query['groupCodes.grup5'] = { $regex: filter.grup5, $options: 'i' };

    if (filter.status) query.status = { $regex: filter.status, $options: 'i' };
    if (filter.operatorCode)
      query.operatorCode = { $regex: filter.operatorCode, $options: 'i' };
    if (filter.operatorName)
      query.operatorName = { $regex: filter.operatorName, $options: 'i' };
    if (filter.product)
      query.product = { $regex: filter.product, $options: 'i' };
    if (filter.combinedVoucher)
      query.combinedVoucher = { $regex: filter.combinedVoucher, $options: 'i' };

    if (filter.hotelName)
      query['itinerary.hotelName'] = {
        $regex: filter.hotelName,
        $options: 'i',
      };
    if (filter.hotelCode)
      query['itinerary.hotelCode'] = {
        $regex: filter.hotelCode,
        $options: 'i',
      };

    if (filter.checkInDate && filter.checkInDateTo) {
      query['itinerary.checkInDate'] = {
        $gte: filter.checkInDate,
        $lte: filter.checkInDateTo,
      };
    }

    if (filter.checkOutDate && filter.checkOutDateTo) {
      query['itinerary.checkOutDate'] = {
        $gte: filter.checkOutDate,
        $lte: filter.checkOutDateTo,
      };
    }

    if (filter.arrivalPNR)
      query['passengers.arrivalFlight.arrivalPNR'] = {
        $regex: filter.arrivalPNR,
        $options: 'i',
      };
    if (filter.arrivalFlightDate)
      query['passengers.arrivalFlight.arrivalFlightDate'] =
        filter.arrivalFlightDate;

    if (filter.departurePNR)
      query['passengers.departureFlight.departurePNR'] = {
        $regex: filter.departurePNR,
        $options: 'i',
      };
    if (filter.departureFlightDate)
      query['passengers.departureFlight.departureFlightDate'] =
        filter.departureFlightDate;

    if (filter.fullName)
      query['passengers.fullName'] = { $regex: filter.fullName, $options: 'i' };

    let reservations = await this.uploadedRecordModel.find(query).lean();

    if (filter.packageName || filter.saleDate || filter.saleDateTo) {
      const saleQuery: any = {};

      if (filter.packageName)
        saleQuery.packageName = { $regex: filter.packageName, $options: 'i' };

      if (filter.saleDate && filter.saleDateTo) {
        saleQuery.saleDate = {
          $gte: new Date(filter.saleDate),
          $lte: new Date(filter.saleDateTo),
        };
      }

      const matchingSales = await this.guideSaleModel.find(saleQuery).lean();
      const matchingVouchers = matchingSales.map((s) => s.combinedVoucher);

      reservations = reservations.filter((r) =>
        matchingVouchers.includes(r.combinedVoucher),
      );
    }

    if (filter.bolgeKodu) {
      const guides = await this.guideModel
        .find({
          bolgeKodu: filter.bolgeKodu,
        })
        .lean();

      const guideIds = guides.map((g) => g._id.toString());

      const guideAssignments = await this.guideAssignmentModel
        .find({
          guideId: { $in: guideIds },
        })
        .lean();

      const allowedKeys = guideAssignments.map((g) =>
        [g.grup1, g.grup2, g.grup5].join('|'),
      );

      return reservations.filter((rec) => {
        const key = [
          rec.groupCodes?.grup1,
          rec.groupCodes?.grup2,
          rec.groupCodes?.grup5,
        ].join('|');
        return allowedKeys.includes(key);
      });
    }

    if (filter.adSoyad) {
      const guides = await this.guideModel
        .find({
          adSoyad: { $regex: filter.adSoyad, $options: 'i' },
        })
        .lean();

      const guideIds = guides.map((g) => g._id.toString());

      const guideAssignments = await this.guideAssignmentModel
        .find({
          guideId: { $in: guideIds },
        })
        .lean();

      const allowedKeys = guideAssignments.map((g) =>
        [g.grup1, g.grup2, g.grup5].join('|'),
      );

      reservations = reservations.filter((r) => {
        const key = [
          r.groupCodes?.grup1,
          r.groupCodes?.grup2,
          r.groupCodes?.grup5,
        ].join('|');
        return allowedKeys.includes(key);
      });
    }

    return reservations;
  }
  async getSalesByCombinedVoucher(combinedVoucher: string) {
    return this.guideSaleModel.find({ combinedVoucher }).lean();
  }
}
