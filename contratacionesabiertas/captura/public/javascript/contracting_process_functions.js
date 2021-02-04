// modelos para infraestructura
const db = require('../../models');
// PostgreSQL database
var db_conf = require('../../db_conf');
// moment format
var moment = require('moment'); // require
const { isNotNullOrEmpty } = require('../../utilities/validation-rules');
// extensiones del release
const _extensions = [
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_requestForQuotes_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_clarificationMeetings_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_paymentMethod_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_taxes_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_publicNotices_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_implementationStatus_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_awardRationale_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_nameBreakdown_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_surveillanceMechanisms_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_extendedProcurementCategory_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_contactPointType_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_budgetLines_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_guarantees_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_procurementUnits_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_exchangeRate_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_location_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_additionalContactPoints_extension/master/extension.json",
    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_memberOf_extension/master/extension.json",
    "https://raw.githubusercontent.com/contratacionesabiertas/ocds_budgetBreakdown_extension/master/extension.json" 
];

module.exports = {
    createPlanningPartyUnits: async function(data){
        var planningUnits = await db.planning_party_unit.findAll({
            attributes: { exclude: ['createdAt','updatedAt']},
            where : {contractingprocess_id: data.contractingprocess_id}
        });
        if(planningUnits !== undefined){
            planningUnits.forEach(async element => {
                await db.planning_party_unit.destroy({
                    where: {id: element.id}
                })
            });
        }
        if(data.requestingunits !== ""){
            if(Array.isArray(data.requestingunits)){
                data.requestingunits.forEach(async element =>{
                    if(element !== ""){
                        var arrayRequestingunits = element.split('/');
                        var code = arrayRequestingunits[0];
                        var name = arrayRequestingunits[1];
                        var requestingUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.requestingunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                        await db.planning_party_unit.create({
                            contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                            party_code: code,
                            party_name: name,
                            party_legal_name: requestingUnitLegalName.identifier_legalname,
                            requesting_unit: true,
                            contracting_unit: false,
                            responsible_unit: false,
                            createdAt : new Date(),
                            updatedAt : new Date()
                        }).then(function(result){
                            return console.log("### requestingunits " + JSON.stringify(result))
                        });
                    } 
                });
            }else{
                var arrayRequestingunits = data.requestingunits.split('/');
                var code = arrayRequestingunits[0];
                var name = arrayRequestingunits[1];
                var requestingUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.requestingunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                await db.planning_party_unit.create({
                    contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                    party_code: code,
                    party_name: name,
                    party_legal_name: requestingUnitLegalName.identifier_legalname,
                    requesting_unit: true,
                    contracting_unit: false,
                    responsible_unit: false,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }).then(function(result){
                    return console.log("### requestingunits " + JSON.stringify(result))
                });
            }
        }
        if(data.contractingunits !== ""){
            if(Array.isArray(data.contractingunits)){
                data.contractingunits.forEach(async element =>{
                    if(element !== ""){
                        var arrayContractingunits = element.split('/');
                        var code = arrayContractingunits[0];
                        var name = arrayContractingunits[1];
                        var contractingUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.contractingunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                        await db.planning_party_unit.create({
                            contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                            party_code: code,
                            party_name: name,
                            party_legal_name: contractingUnitLegalName.identifier_legalname,
                            requesting_unit: false,
                            contracting_unit: true,
                            responsible_unit: false,
                            createdAt : new Date(),
                            updatedAt : new Date()
                        }).then(function(result){
                            return console.log("### contractingunits " + JSON.stringify(result))
                        });
                    } 
                });
            }else{
                var arrayContractingunits = data.contractingunits.split('/');
                var code = arrayContractingunits[0];
                var name = arrayContractingunits[1];
                var contractingUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.contractingunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                await db.planning_party_unit.create({
                    contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                    party_code: code,
                    party_name: name,
                    party_legal_name: contractingUnitLegalName.identifier_legalname,
                    requesting_unit: false,
                    contracting_unit: true,
                    responsible_unit: false,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }).then(function(result){
                    return console.log("### contractingunits " + JSON.stringify(result))
                });
            }
        }
        if(data.responsibleunits !== ""){
            if(Array.isArray(data.responsibleunits)){                
                data.responsibleunits.forEach(async element =>{
                    if(element !== ""){
                        var arrayResponsibleunits = element.split('/');
                        var code = arrayResponsibleunits[0];
                        var name = arrayResponsibleunits[1];
                        var responsibleUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.responsibleunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                        await db.planning_party_unit.create({
                            contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                            party_code: code,
                            party_name: name,
                            party_legal_name: responsibleUnitLegalName.identifier_legalname,
                            requesting_unit: false,
                            contracting_unit: false,
                            responsible_unit: true,
                            createdAt : new Date(),
                            updatedAt : new Date()
                        }).then(function(result){
                            return console.log("### responsibleunits " + JSON.stringify(result))
                        });
                    } 
                });
            }else{
                var arrayResponsibleunits = data.responsibleunits.split('/');
                var code = arrayResponsibleunits[0];
                var name = arrayResponsibleunits[1];
                var responsibleUnitLegalName = await db_conf.edca_db.oneOrNone('select identifier_legalname from parties p join roles r on p.id = r.parties_id where p.contractingprocess_id = $1 and r.responsibleunit = true and p.partyid = $2 and p.name = $3 order by p.id', [data.contractingprocess_id,code,name]);
                await db.planning_party_unit.create({
                    contractingprocess_id: parseInt(data.contractingprocess_id, 10),
                    party_code: code,
                    party_name: name,
                    party_legal_name: responsibleUnitLegalName.identifier_legalname,
                    requesting_unit: false,
                    contracting_unit: false,
                    responsible_unit: true,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }).then(function(result){
                    return console.log("### responsibleunits " + JSON.stringify(result))
                });
            }
        }
        return true;
    },
    getAllIdContractingProcess: async function(){
        var query = `select 
            DISTINCT ON(a.contractingprocess_id) a.contractingprocess_id,
            a.publisher,b.name,b.scheme,b.uid,b.uri
            from logs as a, publisher as b, contractingprocess as c, tender as d, contract as e
            where 1 = 1
            and a.contractingprocess_id = b.contractingprocess_id 
            and a.contractingprocess_id = c.id 
            and d.contractingprocess_id = c.id
            and e.contractingprocess_id = c.id
            and c.published = true\n`;
            query = query+"order by a.contractingprocess_id";
        return await db_conf.edca_db.manyOrNone(query);
    },
    getContractingProcess: async function(params, host, res){
        if(params.year !== 'null' && params.year !== undefined){
            var years = params.year.split(",");
            var filterYear = `and (extract(year from e.datesigned) = '${years[0]}'`;
            if(years.length > 1){
                for (var index = 0 in years) {
                    if(index !== '0'){
                        filterYear = filterYear+` or extract(year from e.datesigned) = '${years[index]}'`
                    }
                }
                filterYear = filterYear+ `)\n`;
            }else{
                filterYear = filterYear+ `)\n`;
            }
        }else{
            var filterYear = ``;
        }
        var query = `select 
            DISTINCT ON(a.contractingprocess_id) a.contractingprocess_id, 
            cast(a.version as int) as version,
            a.id as log_id,a.update_date,a.release_file,
            a.release_json,a.publisher,b.name,b.scheme,b.uid,b.uri,
            c.license,c.publicationpolicy
            from logs as a, publisher as b, contractingprocess as c, tender as d, contract as e
            where 1 = 1
            and a.contractingprocess_id = b.contractingprocess_id 
            and a.contractingprocess_id = c.id 
            and d.contractingprocess_id = c.id
            and e.contractingprocess_id = c.id
            and c.published = true\n`;
            query = query+filterYear;
            query = query+"order by a.contractingprocess_id,cast(a.version as int) desc;";
        // console.log("························· query "  + query);
        var arrayReleasePackage = new Array();    
        let data = await db_conf.edca_db.manyOrNone(query);
        if(data.length !== 0){
            data.forEach(element => {
                var objReleasePackage  = new Object();
                var objPublisher  = new Object();
                objReleasePackage.uri = `${host}/release-package/${element.version}/${element.release_file}`;
                objReleasePackage.version = '1.1';
                objReleasePackage.extensions = _extensions;
                if(element.update_date !== "" && element.update_date !== null)
                    objReleasePackage.publishedDate = element.update_date;
                if(element.release_json !== "" && element.release_json !== null)
                    objReleasePackage.releases = [element.release_json];
                if(element.name !== "" && element.name !== null)
                    objPublisher.name = element.name;
                if(element.scheme !== "" && element.scheme !== null)
                    objPublisher.scheme = element.scheme;
                if(element.uid !== "" && element.uid !== null)
                    objPublisher.uid = element.uid;
                if(element.uri !== "" && element.uri !== null)
                    objPublisher.uri = element.uri;
                if(Object.entries(objPublisher).length !== 0)
                    objReleasePackage.publisher = objPublisher;
                if(element.license !== "" && element.license !== null)
                    objReleasePackage.license = element.license;
                if(element.publicationpolicy !== "" && element.publicationpolicy !== null)
                    objReleasePackage.publicationPolicy = element.publicationpolicy;
                arrayReleasePackage.push(objReleasePackage)
            });
            return isNaturalPerson(arrayReleasePackage);
        }else{
            return false;
        }
    },
    getAdditionalProcurementCategories: async function(params, host, res){
        var typesAdditionalprocurementcategories = params.additionalprocurementcategories.split(",");
        if(params.year !== 'null'){
            var years = params.year.split(",");
            var filterYear = `and (extract(year from e.datesigned) = '${years[0]}'`;
            if(years.length > 1){
                for (var index = 0 in years) {
                    if(index !== '0'){
                        filterYear = filterYear+` or extract(year from e.datesigned) = '${years[index]}'`
                    }
                }
                filterYear = filterYear+ `)\n`;
            }else{
                filterYear = filterYear+ `)\n`;
            }
        }else{
            var filterYear = ``;
        }
        
        console.log("························· typesAdditionalprocurementcategories "  + JSON.stringify(typesAdditionalprocurementcategories));
        
        var filterAdditionalprocurementcategories = `and (d.additionalprocurementcategories = '${typesAdditionalprocurementcategories[0]}'`;
        if(typesAdditionalprocurementcategories.length > 1){
            for (var index = 0 in typesAdditionalprocurementcategories) {
                if(index !== '0'){
                    filterAdditionalprocurementcategories = filterAdditionalprocurementcategories+` or d.additionalprocurementcategories = '${typesAdditionalprocurementcategories[index]}'`
                }
            }
            filterAdditionalprocurementcategories = filterAdditionalprocurementcategories+ `)\n`;
        }else{
            filterAdditionalprocurementcategories = filterAdditionalprocurementcategories+ `)\n`;
        }

        var arrayReleasePackage = new Array();
        var query = `select 
            DISTINCT ON(a.contractingprocess_id) a.contractingprocess_id, 
            cast(a.version as int) as version,
            a.id as log_id,a.update_date,a.release_file,
            a.release_json,a.publisher,b.name,b.scheme,b.uid,b.uri,
            c.license,c.publicationpolicy
            from logs as a, publisher as b, contractingprocess as c, tender as d, contract as e
            where 1 = 1
            and a.contractingprocess_id = b.contractingprocess_id 
            and a.contractingprocess_id = c.id 
            and d.contractingprocess_id = c.id
            and e.contractingprocess_id = c.id
            and c.published = true \n`;
            query = query+filterAdditionalprocurementcategories;
            query = query+filterYear;
            query = query+"order by a.contractingprocess_id,cast(a.version as int) desc;";
        console.log("························· query "  + query);    
        let data = await db_conf.edca_db.manyOrNone(query);
        if(data.length !== 0){
            data.forEach(element => {
                var objReleasePackage  = new Object();
                var objPublisher  = new Object();
                objReleasePackage.uri = `${host}/release-package/${element.version}/${element.release_file}`;
                objReleasePackage.version = '1.1';
                objReleasePackage.extensions = _extensions;
                if(element.update_date !== "" && element.update_date !== null)
                    objReleasePackage.publishedDate = element.update_date;
                if(element.release_json !== "" && element.release_json !== null)
                    objReleasePackage.releases = [element.release_json];
                if(element.name !== "" && element.name !== null)
                    objPublisher.name = element.name;
                if(element.scheme !== "" && element.scheme !== null)
                    objPublisher.scheme = element.scheme;
                if(element.uid !== "" && element.uid !== null)
                    objPublisher.uid = element.uid;
                if(element.uri !== "" && element.uri !== null)
                    objPublisher.uri = element.uri;
                if(Object.entries(objPublisher).length !== 0)
                    objReleasePackage.publisher = objPublisher;
                if(element.license !== "" && element.license !== null)
                    objReleasePackage.license = element.license;
                if(element.publicationpolicy !== "" && element.publicationpolicy !== null)
                    objReleasePackage.publicationPolicy = element.publicationpolicy;
                arrayReleasePackage.push(objReleasePackage)
            });
            return isNaturalPerson(arrayReleasePackage)
        }else{
            return false
        }
    }, 
    getProcurementMethod: async function(params, host, res){
        var typesProcurementmethod = params.procurementmethod.split(",");
        if(params.year !== 'null'){
            var years = params.year.split(",");
            var filterYear = `and (extract(year from e.datesigned) = '${years[0]}'`;
            if(years.length > 1){
                for (var index = 0 in years) {
                    if(index !== '0'){
                        filterYear = filterYear+` or extract(year from e.datesigned) = '${years[index]}'`
                    }
                }
                filterYear = filterYear+ `)\n`;
            }else{
                filterYear = filterYear+ `)\n`;
            }
        }else{
            var filterYear = ``;
        }

        var filterProcurementMethod = `and (d.procurementmethod_details = '${typesProcurementmethod[0]}'`;
        if(typesProcurementmethod.length > 1){
            for (var index = 0 in typesProcurementmethod) {
                if(index !== '0'){
                    filterProcurementMethod = filterProcurementMethod+` or d.procurementmethod_details = '${typesProcurementmethod[index]}'`
                }
            }
            filterProcurementMethod = filterProcurementMethod+ `)\n`;
        }else{
            filterProcurementMethod = filterProcurementMethod+ `)\n`;
        }
        
        var arrayReleasePackage = new Array();
        var query = `select 
            DISTINCT ON(a.contractingprocess_id) a.contractingprocess_id, 
            cast(a.version as int) as version,
            a.id as log_id,a.update_date,a.release_file,
            a.release_json,a.publisher,b.name,b.scheme,b.uid,b.uri,
            c.license,c.publicationpolicy
            from logs as a, publisher as b, contractingprocess as c, tender as d, contract as e
            where 1 = 1
            and a.contractingprocess_id = b.contractingprocess_id 
            and a.contractingprocess_id = c.id 
            and d.contractingprocess_id = c.id
            and e.contractingprocess_id = c.id
            and c.published = true \n`;
            query = query+filterProcurementMethod;
            query = query+filterYear;
            query = query+"order by a.contractingprocess_id,cast(a.version as int) desc;";
        // console.log("························· query "  + query);    
        let data = await db_conf.edca_db.manyOrNone(query);
        if(data.length !== 0){
            data.forEach(element => {
                var objReleasePackage  = new Object();
                var objPublisher  = new Object();
                objReleasePackage.uri = `${host}/release-package/${element.version}/${element.release_file}`;
                objReleasePackage.version = '1.1';
                objReleasePackage.extensions = _extensions;
                if(element.update_date !== "" && element.update_date !== null)
                    objReleasePackage.publishedDate = element.update_date;
                if(element.release_json !== "" && element.release_json !== null)
                    objReleasePackage.releases = [element.release_json];
                if(element.name !== "" && element.name !== null)
                    objPublisher.name = element.name;
                if(element.scheme !== "" && element.scheme !== null)
                    objPublisher.scheme = element.scheme;
                if(element.uid !== "" && element.uid !== null)
                    objPublisher.uid = element.uid;
                if(element.uri !== "" && element.uri !== null)
                    objPublisher.uri = element.uri;
                if(Object.entries(objPublisher).length !== 0)
                    objReleasePackage.publisher = objPublisher;
                if(element.license !== "" && element.license !== null)
                    objReleasePackage.license = element.license;
                if(element.publicationpolicy !== "" && element.publicationpolicy !== null)
                    objReleasePackage.publicationPolicy = element.publicationpolicy;
                arrayReleasePackage.push(objReleasePackage)
            });
            return isNaturalPerson(arrayReleasePackage);
        }else{
            return false
        }
    },
    createFiscalYears: async function(data){
        if(!Array.isArray(data.items)){
            var arrayItems = new Array();
            arrayItems.push(data.items);
            data.items = arrayItems;
        }
        console.log(`### createFiscalYears ${JSON.stringify(data.items)}`)
        var fiscalYears = await db.edca_fiscal_year.findAll();
        if(fiscalYears.length > 0){
            deleteFiscalYears(fiscalYears).then( () =>{
                data.items.forEach(async item => {
                    await db.edca_fiscal_year.create({
                        year: item,
                        status: true,
                        createdAt : new Date(),
                        updatedAt : new Date()
                    }).then(function(result){
                        return console.log("### fiscalYear " + JSON.stringify(result))
                    });
                });
            })
        }else{
            data.items.forEach(async item => {
                await db.edca_fiscal_year.create({
                    year: item,
                    status: true,
                    createdAt : new Date(),
                    updatedAt : new Date()
                }).then(function(result){
                    return console.log("### fiscalYear " + JSON.stringify(result))
                });
            });
        }
    },
    getFiscalYears: async function(){
        console.log(`### getFiscalYears`)
        return await db.edca_fiscal_year.findAll();
    }
};

async function deleteFiscalYears(fiscalYears){
    fiscalYears.forEach(async fiscalYear => {
        await db.edca_fiscal_year.destroy({
            where: {id: fiscalYear.id}
        })
    });
    return true;
};

function isNaturalPerson(arrayReleasePackage){
    console.log(`### isNaturalPerson`)
    arrayReleasePackage.forEach(package => {
        package.releases.forEach(release => {
            var arrayParties = new Array();
            release.parties.forEach(partie => {
                var objPartie = new Object();
                var objIdentifier = new Object();
                var objAddress = new Object();
                var objContactPoint = new Object();
                var flagRol = false;
                if(partie.identifier.legalPersonality == 'naturalPerson'){
                    if(partie.roles !== undefined){
                        partie.roles.forEach(rol => {
                            if(rol == 'tenderer' || rol == 'supplier' || rol == 'issuingSupplier' || rol == 'official'){
                                flagRol = true;
                            }
                        });
                    }
                    if(flagRol){
                        if(partie.identifier.scheme !== null && partie.identifier.scheme !== "")
                        objIdentifier.scheme = partie.identifier.scheme;
                        if(partie.identifier.id !== null && partie.identifier.id !== "")
                        objIdentifier.id = partie.identifier.id;
                        if(partie.identifier.legalName !== null && partie.identifier.legalName !== "")
                        objIdentifier.legalName = partie.identifier.legalName;
                        if(partie.identifier.legalPersonality !== null && partie.identifier.legalPersonality !== "")
                        objIdentifier.legalPersonality = partie.identifier.legalPersonality ? 'naturalPerson' : 'legalPerson';
                        if(partie.identifier.givenName !== null && partie.identifier.givenName !== "")
                        objIdentifier.givenName = partie.identifier.givenName;
                        if(partie.identifier.patronymicName !== null && partie.identifier.patronymicName !== "")
                        objIdentifier.patronymicName = partie.identifier.patronymicName;
                        if(partie.identifier.matronymicName !== null && partie.identifier.matronymicName !== "")
                        objIdentifier.matronymicName = partie.identifier.matronymicName;

                        if(partie.contactPoint !== undefined){
                            if(partie.contactPoint.name !== null && partie.contactPoint.name !== "")
                            objContactPoint.name = partie.contactPoint.name;
                            if(partie.contactPoint.email !== null && partie.contactPoint.email !== "")
                            objContactPoint.email = partie.contactPoint.email;
                            if(partie.contactPoint.telephone !== null && partie.contactPoint.telephone !== "")
                            objContactPoint.telephone = partie.contactPoint.telephone;
                            if(partie.contactPoint.faxNumber !== null && partie.contactPoint.faxNumber !== "")
                            objContactPoint.faxNumber = partie.contactPoint.faxNumber;
                            if(partie.contactPoint.url !== null && partie.contactPoint.url !== "")
                            objContactPoint.url = partie.contactPoint.url;
                            if(partie.contactPoint.type !== null && partie.contactPoint.type !== "")
                            objContactPoint.type = partie.contactPoint.type;
                            if(partie.contactPoint.givenName !== null && partie.contactPoint.givenName !== "")
                            objContactPoint.givenName = partie.contactPoint.givenName;
                            if(partie.contactPoint.patronymicName !== null && partie.contactPoint.patronymicName !== "")
                            objContactPoint.patronymicName = partie.contactPoint.patronymicName;
                            if(partie.contactPoint.matronymicName !== null && partie.contactPoint.matronymicName !== "")
                            objContactPoint.matronymicName = partie.contactPoint.matronymicName;
                            if(partie.contactPoint.language !== null && partie.contactPoint.language !== "")
                            objContactPoint.availableLanguage = partie.contactPoint.language ? partie.contactPoint.language.split(',') : undefined
                        }
                        
                        
                        if(partie.address !== undefined){
                            if(partie.address.streetAddress !== null && partie.address.streetAddress !== "")
                            objAddress.streetAddress = partie.address.streetAddress;
                            if(partie.address.locality !== null && partie.address.locality !== "")
                            objAddress.locality = partie.address.locality;
                            if(partie.address.region !== null && partie.address.region !== "")
                            objAddress.region = partie.address.region;
                            if(partie.address.postalCode !== null && partie.address.postalCode !== "")
                            objAddress.postalCode = partie.address.postalCode;
                            if(partie.address.countryName !== null && partie.address.countryName !== "")
                            objAddress.countryName = partie.address.countryName;
                        }
                        
                        if(partie.name !== null && partie.name !== "")
                        objPartie.name = partie.name;
                        if(partie.id !== null && partie.id !== "")
                        objPartie.id = partie.id;
                        if(Object.entries(objIdentifier).length > 0)
                        objPartie.identifier = objIdentifier;
                        if(Object.entries(objAddress).length > 0)
                        objPartie.address = objAddress;
                        if(Object.entries(objContactPoint).length > 0)
                        objPartie.contactPoint = objContactPoint;

                        if(partie.roles !== undefined)
                        objPartie.roles = partie.roles;
                        if(partie.memberOf !== undefined)
                        objPartie.memberOf = partie.memberOf;
                        if(partie.additionalContactPoints !== undefined)
                        objPartie.additionalContactPoints = partie.additionalContactPoints;
                        if(partie.position !== "" && partie.position !== null)
                        objPartie.position = partie.position;
                        arrayParties.push(objPartie)
                    }else{
                        if(partie.identifier.scheme !== null && partie.identifier.scheme !== "")
                        objIdentifier.scheme = partie.identifier.scheme;
                        if(partie.identifier.id !== null && partie.identifier.id !== "")
                        objIdentifier.id = partie.identifier.id;
                        if(partie.identifier.legalName !== null && partie.identifier.legalName !== "")
                        objIdentifier.legalName = partie.identifier.legalName;
                        if(partie.identifier.legalPersonality !== null && partie.identifier.legalPersonality !== "")
                        objIdentifier.legalPersonality = partie.identifier.legalPersonality ? 'naturalPerson' : 'legalPerson';
                        if(partie.identifier.givenName !== null && partie.identifier.givenName !== "")
                        objIdentifier.givenName = partie.identifier.givenName;
                        if(partie.identifier.patronymicName !== null && partie.identifier.patronymicName !== "")
                        objIdentifier.patronymicName = partie.identifier.patronymicName;
                        if(partie.identifier.matronymicName !== null && partie.identifier.matronymicName !== "")
                        objIdentifier.matronymicName = partie.identifier.matronymicName;

                        if(partie.name !== null && partie.name !== "")
                        objPartie.name = partie.name;
                        if(partie.id !== null && partie.id !== "")
                        objPartie.id = partie.id;
                        if(Object.entries(objIdentifier).length > 0)
                        objPartie.identifier = objIdentifier;
                        if(partie.roles !== undefined)
                        objPartie.roles = partie.roles;
                        arrayParties.push(objPartie)
                    }
                }else{
                    if(partie.identifier.scheme !== null && partie.identifier.scheme !== "")
                    objIdentifier.scheme = partie.identifier.scheme;
                    if(partie.identifier.id !== null && partie.identifier.id !== "")
                    objIdentifier.id = partie.identifier.id;
                    if(partie.identifier.legalName !== null && partie.identifier.legalName !== "")
                    objIdentifier.legalName = partie.identifier.legalName;
                    if(partie.identifier.legalPersonality !== null && partie.identifier.legalPersonality !== "")
                    objIdentifier.legalPersonality = partie.identifier.legalPersonality ? 'naturalPerson' : 'legalPerson';
                    if(partie.identifier.givenName !== null && partie.identifier.givenName !== "")
                    objIdentifier.givenName = partie.identifier.givenName;
                    if(partie.identifier.patronymicName !== null && partie.identifier.patronymicName !== "")
                    objIdentifier.patronymicName = partie.identifier.patronymicName;
                    if(partie.identifier.matronymicName !== null && partie.identifier.matronymicName !== "")
                    objIdentifier.matronymicName = partie.identifier.matronymicName;

                    if(partie.contactPoint !== undefined){
                        if(partie.contactPoint.name !== null && partie.contactPoint.name !== "")
                        objContactPoint.name = partie.contactPoint.name;
                        if(partie.contactPoint.email !== null && partie.contactPoint.email !== "")
                        objContactPoint.email = partie.contactPoint.email;
                        if(partie.contactPoint.telephone !== null && partie.contactPoint.telephone !== "")
                        objContactPoint.telephone = partie.contactPoint.telephone;
                        if(partie.contactPoint.faxNumber !== null && partie.contactPoint.faxNumber !== "")
                        objContactPoint.faxNumber = partie.contactPoint.faxNumber;
                        if(partie.contactPoint.url !== null && partie.contactPoint.url !== "")
                        objContactPoint.url = partie.contactPoint.url;
                        if(partie.contactPoint.type !== null && partie.contactPoint.type !== "")
                        objContactPoint.type = partie.contactPoint.type;
                        if(partie.contactPoint.givenName !== null && partie.contactPoint.givenName !== "")
                        objContactPoint.givenName = partie.contactPoint.givenName;
                        if(partie.contactPoint.patronymicName !== null && partie.contactPoint.patronymicName !== "")
                        objContactPoint.patronymicName = partie.contactPoint.patronymicName;
                        if(partie.contactPoint.matronymicName !== null && partie.contactPoint.matronymicName !== "")
                        objContactPoint.matronymicName = partie.contactPoint.matronymicName;
                        if(partie.contactPoint.language !== null && partie.contactPoint.language !== "")
                        objContactPoint.availableLanguage = partie.contactPoint.language ? partie.contactPoint.language.split(',') : undefined
                    }
                    
                    if(partie.address !== undefined){
                        if(partie.address.streetAddress !== null && partie.address.streetAddress !== "")
                        objAddress.streetAddress = partie.address.streetAddress;
                        if(partie.address.locality !== null && partie.address.locality !== "")
                        objAddress.locality = partie.address.locality;
                        if(partie.address.region !== null && partie.address.region !== "")
                        objAddress.region = partie.address.region;
                        if(partie.address.postalCode !== null && partie.address.postalCode !== "")
                        objAddress.postalCode = partie.address.postalCode;
                        if(partie.address.countryName !== null && partie.address.countryName !== "")
                        objAddress.countryName = partie.address.countryName;
                    }
                    
                    if(partie.name !== null && partie.name !== "")
                    objPartie.name = partie.name;
                    if(partie.id !== null && partie.id !== "")
                    objPartie.id = partie.id;
                    if(Object.entries(objIdentifier).length > 0)
                    objPartie.identifier = objIdentifier;
                    if(Object.entries(objAddress).length > 0)
                    objPartie.address = objAddress;
                    if(Object.entries(objContactPoint).length > 0)
                    objPartie.contactPoint = objContactPoint;

                    if(partie.roles !== undefined)
                    objPartie.roles = partie.roles;
                    if(partie.memberOf !== undefined)
                    objPartie.memberOf = partie.memberOf;
                    if(partie.additionalContactPoints !== undefined)
                    objPartie.additionalContactPoints = partie.additionalContactPoints;
                    if(partie.position !== "" && partie.position !== null)
                    objPartie.position = partie.position;
                    arrayParties.push(objPartie)
                }
            });
            release.parties = arrayParties;
        });
    });
    return arrayReleasePackage;
}