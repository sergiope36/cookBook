export class Likes {
    public likes_id?: number;
    public user_id: number;
    public recipe_id: number;
    public count?: number


    constructor (user_id: number, recipe_id: number, count:number){
        this.user_id = user_id;
        this.recipe_id = recipe_id;

       
        
    }
}


