const should = require('chai').should();
const PersonDetailResult = require('../../dataLayer/PersonDetailResult');

describe('PersonDetailResult class', () => {
    // Sample response from the https://appsheettest1.azurewebsites.net/sample/detail/1 endpoint
    const detailResponseData = {
        "id": 1,
        "name": "bill",
        "age": 39,
        "number": "555-555-5555",
        "photo": "https://appsheettest1.azurewebsites.net/male-16.jpg",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ex sapien, interdum sit amet tempor sit amet, pretium id neque. Nam ultricies ac felis ut lobortis. Praesent ac purus vitae est dignissim sollicitudin. Duis iaculis tristique euismod. Nulla tellus libero, gravida sit amet nisi vitae, ultrices venenatis turpis. Morbi ut dui nunc."
    };

    it('will provide a factory method to parse the response from the person detail endpoint', () => {
        const personDetail = PersonDetailResult.createFrom(detailResponseData);
        
        should.exist(personDetail);
        personDetail.should.be.an.instanceOf(PersonDetailResult);
    });

    it('will provide a properties on the person detail object', () => {
        const personDetail = PersonDetailResult.createFrom(detailResponseData);
        
        should.exist(personDetail);
        personDetail.should.have.property('age').that.is.an('Number');
        personDetail.should.have.property('id').that.is.an('Number');
        personDetail.should.have.property('number').that.is.a('string').and.is.not.empty;
        personDetail.should.have.property('photo').that.is.a('string').and.is.not.empty;
        personDetail.should.have.property('bio').that.is.a('string').and.is.not.empty;
    });
});