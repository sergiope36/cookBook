export class Lessons {
    public title: string;
    public date: Date;
    public timetable: string;
    public dificulty: string;
    public price: number;
    public ingredients: string;
    public description: string;
    public image: string;
    public user_id?: number;
    public lesson_id?: number;

    constructor (title: string,  date: Date, timetable: string, dificulty: string, price: number,ingredients:string, description:string,image: string, user_id?:number){
        this.title = title;
        this.date = date;
        this.timetable = timetable;
        this.dificulty = dificulty;
        this.price = price;
        this.ingredients = ingredients;
        this.description =description
        this.image = image;
        this.user_id = user_id;
        
    }

}