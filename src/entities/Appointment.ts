import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  patient: User;

  @ManyToOne(() => User, { nullable: false })
  doctor: User;

  @Column({ type: "timestamp" })
  appointmentDate: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
}
