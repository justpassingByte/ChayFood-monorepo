import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyNutritionService } from './family-nutrition.service';
import { FamilyController } from './family.controller';

@Module({
  controllers: [FamilyController],
  providers: [FamilyService, FamilyNutritionService],
  exports: [FamilyService, FamilyNutritionService],
})
export class FamilyModule {}
