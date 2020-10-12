export class Comments {
    public comment_id?: number;
    public user_name: string;
    public description: string;
    public user_id: number;
    public recipe_id?: number;

    constructor(user_name: string, description: string, recipe_id: number, user_id: number, comment_id?: number){
        this.user_name = user_name;
        this.comment_id = comment_id;
        this.description = description;
        this.user_id = user_id;
        this.recipe_id = recipe_id;


    }

}
