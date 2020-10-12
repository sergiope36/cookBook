export class Favorite {
    public user_fav_id: number;
    public recipe_id: number;
    public user_id: number;


    constructor (user_fav_id: number,  recipe_id: number, user_id: number){
        this.user_fav_id = user_fav_id;
        this.recipe_id = recipe_id
        this.user_id = user_id;
        
    }

}

