/*
        async getRols(){
            try {
                this.rols = await RolServices.getRols()
            } catch (err) {
                this.error = err
            }
        },
        async getPermissions(){
            try {
            } catch (err) {
                this.error = err
            }
        },
        addNewEntity(newEntity){
            this.entitys = [...this.entitys,this.createEntity("e" + this.entitys.length,newEntity.name,newEntity.perms)]
            let i = 0
            while (i < newEntity.perms.length) {
                this.permissions = [...this.permissions,newEntity.perms[i]]
                i+=1
            }
            this.test = this.permissions
        },
        createNewPerm(name){
            return {
                name
            }
        },
        addTempPerm(tempEntityPerms,tempPerm){
            tempEntityPerms = [...tempEntityPerms,tempPerm]
            return tempEntityPerms
        },
        addNewPermsArray(permsArray, entityPermStringArray){
           permsArray = permsArray.concat(entityPermStringArray)
           return permsArray
        },
        addNewPerm(perm, permsArray){
            permsArray = [...permsArray.perms]
            return permsArray
        },
        addNewRol(id,name,permsArray,rolsArray,defaultPermsPartialName){
            let newRol = this.createNewRol(id,name,this.getsMatchesInPerms(defaultPermsPartialName,permsArray))
            rolsArray.push(newRol)
            this.hideNewRolInput()
            this.setRolTempToDefault()
        },
        createNewRol(id,name,perms){
            return {
                id,
                name,
                perms
            }
        },
        createEntity(id,name,perms){
            return {
                id,
                name,
                perms
            }
        },
        getsMatchesInPerms(target,permArray){
            let  i = 0
            let matchPerms = []
            while (i < permArray.length) {
                if(permArray[i].includes(target)){
                    matchPerms = [...matchPerms,permArray[i]]
                }
                i+=1
            }
            return matchPerms
        },
        mapToEntityPermsArrays(perms){
            let entityPerms = []
            let i = 0
            while (i < perms.length) {
                entityPerms = [...entityPerms,perms[i].split(':')]
                i+=1
            }
            return entityPerms
        },
        createEntityPermitionString(entityName, permissionName){
            return entityName + ':' + permissionName
        },
        getPermissionStrings(entityPermsArray){
            let perms = []
            while (entityPermsArray.length > 0) {
                let currentperm = entityPermsArray[0][1]
                entityPermsArray = entityPermsArray.filter(e => e[1] != currentperm)
                perms = [...perms,currentperm]
            }
            return perms
        },
        getEntityObjects(entityPermsArray){
            let entityObjects = []
            let id = 0
            while (entityPermsArray.length > 0) {
                let currentEntity = entityPermsArray[0][0]
                let currentEntityPerms = entityPermsArray.filter(e => e[0] == currentEntity).map(e => this.createEntityPermitionString(e[0],e[1]))
                entityObjects = [...entityObjects,this.createEntity('e'+id,currentEntity,currentEntityPerms)]
                entityPermsArray = entityPermsArray.filter(e => e[0] != currentEntity)
                id+=1
            }
            return entityObjects
        },
        hasAllpermissions(rolPerms,allPerms){
            let hasAll = true
            let i = 0
            while(i < allPerms.length && hasAll){
                if (!rolPerms.includes(allPerms[i])) {
                    hasAll = false
                }
                i+=1
            }
            return hasAll
        },
        hasPermition(rolPerms,perm){
            let has = " "
            if(rolPerms.includes(perm)){
                has = "X"
            }
            return has
        },
        alternatePermission(rolPerms,perm){
            if(this.hasPermition(rolPerms,perm) == "X"){
                rolPerms = rolPerms.filter(e => e!=perm)
            }else{
                rolPerms = [...rolPerms,perm]
            }
            return rolPerms
        },
        alternateAllPermission(rolPerms,allPerms){
            if(this.hasAllpermissions(rolPerms,allPerms)){
                rolPerms = []
            }else{
                rolPerms = this.addAllPermission(rolPerms,allPerms)
            }
            return rolPerms
        },
        addAllPermission(rolPerms,allPerms){
            rolPerms = allPerms
            return rolPerms
        },
        removeAllEntityPermission(entityPerms, rolsArray){
            let i = 0
            while (i < rolsArray.length) {
                let j = 0
                while (j < entityPerms.length) {
                    rolsArray[i].perms = rolsArray[i].perms.filter(e => e!= entityPerms[j])
                    j+=1
                }
                i+=1
            }
        },
        addAllEntityPermissions(entityPerms, rolsArray){
            let i = 0
            while (i < rolsArray.length) {
                let j = 0
                while (j < entityPerms.length) {
                    if(this.hasPermition(rolsArray[i].perms,entityPerms[j]) != "X"){
                        rolsArray[i].perms = [...rolsArray[i].perms,entityPerms[j]]
                    }
                    j+=1
                }
                i+=1
            }
        },
        isAllEntityPermissionsAdded(entityPerms, rolsArray){
            let i = 0
            let missing = false
            while (i < rolsArray.length && !missing) {
                if(!this.hasAllpermissions(rolsArray[i].perms,entityPerms)){
                    missing = true
                }
                i+=1
            }
            return missing
        },
        alternateAllEntityPermissions(entityPerms, rolsArray){
            let missing= this.isAllEntityPermissionsAdded(entityPerms, rolsArray)
            if(missing){
                this.addAllEntityPermissions(entityPerms, rolsArray)
            }else{
                this.removeAllEntityPermission(entityPerms, rolsArray)
            }
        },
        isPermissionAddedInAllRols(perm,rolsArray){
            let i = 0
            let isAdded = true
            while (i < rolsArray.length && isAdded) {
                if(!rolsArray[i].perms.includes(perm)){
                    isAdded = false
                }
                i+=1
            }
            return isAdded
        },
        addOnePermissionToAllRols(perm,rolsArray){
            let i = 0
            while (i < rolsArray.length) {
                if(!rolsArray[i].perms.includes(perm)){
                    rolsArray[i].perms = [...rolsArray[i].perms,perm]
                }   
                i+=1
            }
        },
        removeOnePermissionToAllRols(perm,rolsArray){
            let i = 0
            while (i < rolsArray.length) {
                rolsArray[i].perms = rolsArray[i].perms.filter(e => e != perm)  
                i+=1
            }
        },
        alternateOnePermissionInAllRols(perm,rolsArray){
            if(!this.isPermissionAddedInAllRols(perm,rolsArray)){
                this.addOnePermissionToAllRols(perm,rolsArray)
            }else{
                this.removeOnePermissionToAllRols(perm,rolsArray)
            }
        },
        setRolTempToDefault(){
            this.temp.tempRol.name = ""
        },
        openModal(){
            this.$refs.entityModal.style.display = "block";
        },
        closeModal(){
            this.$refs.entityModal.style.display = "none";
        },
        makeCheckboxVisible(checkId){
            document.getElementById(checkId).style.visibility = "visible"
        },
        makeCheckboxInvisible(checkId){
            document.getElementById(checkId).style.visibility = "hidden"
        },
        showNewRolInput(){
            this.$refs.addNewRol.style.display = "none";
            this.$refs.inputTr.style.display = 'table-row'
        },
        hideNewRolInput(){
            this.$refs.addNewRol.style.display = 'table-row';
            this.$refs.inputTr.style.display = 'none'
        },
        parseToDisplayFormat(string){
            let stringArray = []
            stringArray = string.split("_").map(s => this.firstUpperCaseRestLowerCase(s))
            let parseString = ""
            let i = 0
            while(i < stringArray.length){
                parseString = parseString + stringArray[i]
                if(i+1 != stringArray.length){
                    parseString = parseString + " "
                }
                i+=1
            }
            return parseString
        },
        parseToDBFormat(string){
            let stringArray = []
            stringArray = string.split(" ").map(s => s.toUpperCase())
            let parseString = ""
            let i = 0
            while(i < stringArray.length){
                parseString = parseString + stringArray[i]
                if(i+1 != stringArray.length && parseString.charAt(parseString.length-1)!="_"){
                    parseString = parseString + "_"
                }
                i+=1
            }
            return parseString
        },
        firstLatterToUpperCase(string){
            return string.charAt(0).toUpperCase() + string.slice(1)
        },
        firstUpperCaseRestLowerCase(string){
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
        },
        isStringBlank(string){
            let isBlank = true
            if(string.split("").filter(s => s!=" ").length > 0){
                isBlank = false
            }
            return isBlank
        }
     */