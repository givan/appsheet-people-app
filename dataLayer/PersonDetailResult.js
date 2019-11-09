class PersonDetailResult {
    /**
     * Factory method that initializes the new instance using the response from the /detail person endpoint
     * @param {*} data the response from the /detail endpoint
     */
    static createFrom(data) {
        // This method parses the response as returned from
        // the https://appsheettest1.azurewebsites.net/sample/detail/1 endpoint

        return new PersonDetailResult(
            data.id, data.name, data.age, 
            data.number, data.photo, data.bio);
    }

    /**
     * Constructs a new person details object
     * @param {Number} id the person id (required)
     * @param {string} name the person name (required)
     * @param {number} age person's age (required)
     * @param {string} number person's phone number
     * @param {string} photo person's photo url
     * @param {string} bio person's bio
     */
    constructor(id, name, age, number, photo, bio) {
        if (!id) throw new Error('PersonDetailResult.id is not specified and is required');
        if (!name) throw new Error('PersonDetailResult.name is not specified and is required');
        if (!age) throw new Error('PersonDetailResult.age is not specified and is required');
        
        this.id = id;
        this.name = name;
        this.age = age;
        this.number = number;
        this.photo = photo;
        this.bio = bio;
    }
}

module.exports = PersonDetailResult;