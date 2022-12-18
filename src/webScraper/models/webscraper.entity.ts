import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { IsNotEmpty, IsEmpty } from 'class-validator';


@Entity('property')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @IsNotEmpty()
  @Column({nullable: false})
  address: string;

  @IsNotEmpty()
  @Column({nullable: false})
  telephone: string;

  @IsNotEmpty()
  @Column({nullable: false})
  website: string;

  @IsEmpty()
  @Column({nullable: true})
  canLeaveDogsUnattended: boolean;

  @IsEmpty()
  @Column({nullable: true})
  maxDogs: number;

  @IsEmpty()
  @Column({nullable: true})
  extraCharge: boolean;

  @IsNotEmpty()
  @Column({nullable: false})
  type: string;
};
