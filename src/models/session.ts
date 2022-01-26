import { Table, Model, Column, DataType } from 'sequelize-typescript'

@Table
class Session extends Model {
    @Column({
        type: DataType.JSON
    })
    options!: string[]

}

export default Session