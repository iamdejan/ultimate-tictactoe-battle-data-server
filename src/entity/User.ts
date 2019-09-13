import {Entity, Column, PrimaryColumn} from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity("users")
export class User {

    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    public hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

}
