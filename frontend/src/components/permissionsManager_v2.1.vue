<template>
	<div class="main">
		<div class="text-aling-center flex-container">
			<div>
				<button class="warning" @click="openModal('id01')">Add Entity</button>
			</div>
			<div>
				<button class="warning" @click="openModal('m2')">Add Permissions to Entity</button>
			</div>
			<div>
				<button class="warning" @click="listDuplicatedRols()">Duplicated Roles</button>
			</div>
		</div>
		<div id="m2" class="modal" ref="permModal">
			<form class="modal-content animate">
				<div class="modal-header">
					<span class="close" title="Close Modal" @click="closeModal('m2')">&times;</span>
					<h2>Add new permission to entity</h2>
				</div>
				<div class="container">
					<label for="uname">
						<b>Entity Name</b>
					</label>
					<select name id v-model="sEntityName">
						<option v-for="entity in entities" :key="entity._id">
							<label for>{{entity.name}}</label>
						</option>
					</select>
					<div v-if="(!isStringBlank(sEntityName))">
						<label for="psw">
							<b>Permission</b>
						</label>
						<div class="flex-container">
							<input
								class="invalid"
								type="text"
								placeholder="Enter permission"
								name="psw"
								required
								v-model="sPermName"
								@change=" validateStrings(sPermName, '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$', 'warnEntityPerm2')"
							/>
						</div>
						<div class="text-aling-center">
							<label
								class="visibility-hidden"
								id="warnEntityPerm2"
								for
							>Only letters allowed in the permission name</label>
						</div>
					</div>
				</div>

				<div
					v-show="evaluateRegularExpression(sPermName,'[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')"
					class="container text-aling-center"
					style="background-color:#f1f1f1"
				>
					<button type="button" class="addBtn" @click="addPermitionToEntity()">Add new Permission</button>
				</div>
			</form>
		</div>
		<!-- The Modal -->
		<div id="m3" class="modal" ref="duplicatedModal">
			<!-- Modal Content -->
			<div class="modal-content animate">
				<div class="modal-header">
					<span class="close" title="Close Modal" @click="closeModal('m3')">&times;</span>
					<h2>List duplicate roles</h2>
				</div>
				<div class="container">
					<div class="table-wrapper" v-if="duplicated.length > 0">
						<table>
							<thead>
								<tr>
									<th rowspan="2">Roles</th>
									<th rowspan="2">Common permissions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in this.duplicated" :key="item">
									<td>
										<div v-for="rol in item.uniqueIds" :key="rol">
											<h4>{{rol}}</h4>
										</div>
									</td>
									<td>
										<div v-for="permission in item._id.permissions" :key="permission">
											<h4>{{permission}}</h4>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div v-else>
						<h3 class="duplicated-roles">Not exist duplicated roles</h3>
					</div>
				</div>
			</div>
		</div>
		<!-- The Modal -->
		<div id="id01" class="modal" ref="entityModal">
			<!-- Modal Content -->
			<form class="modal-content animate">
				<div class="modal-header">
					<span class="close" title="Close Modal" @click="closeModal('id01')">&times;</span>
					<h2>Add new entity</h2>
				</div>
				<span class="close" title="Close Modal" @click="closeModal('id01')">&times;</span>
				<div class="container">
					<label for="uname">
						<b>Entity Name</b>
					</label>
					<input
						type="text"
						placeholder="Enter Entity Name"
						name="uname"
						required
						v-model="tEntityName"
						@change=" validateStrings(tEntityName, '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$', 'warnEntityName')"
					/>
					<div class="text-aling-center">
						<label class="visibility-hidden" id="warnEntityName" for>Only letters allowed in the name</label>
					</div>
					<div v-if="(!isStringBlank(tEntityName))">
						<label class="margit-top-2" for="psw">
							<b>Permissions</b>
						</label>
						<div class="flex-container">
							<input
								type="text"
								placeholder="Enter permission"
								name="psw"
								required
								v-model="tPermName"
								@change=" validateStrings(tPermName, '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$', 'warnEntityPerm')"
							/>
							<button
								class="addBtn"
								v-show="(!isStringBlank(tPermName) && 
                                evaluateRegularExpression(tPermName,'[a-zA-Z][a-zA-Z ]+[a-zA-Z]$'))"
								@click.prevent="tEntityPerms = addTempPerm(tEntityPerms,tPermName.toLowerCase())"
							>+</button>
						</div>
						<div class="text-aling-center">
							<label
								class="visibility-hidden"
								id="warnEntityPerm"
								for
							>Only letters allowed in the permission name</label>
						</div>
						<ul v-show="tEntityPerms.length > 0" class="col-5 gap-5 margin-top-2">
							<li v-for="(perm,index) in tEntityPerms" :key="index">
								<label for>{{perm}}</label>
							</li>
						</ul>
					</div>
				</div>
				<div
					v-show="(!isStringBlank(tEntityName) && evaluateRegularExpression(tEntityName,'[a-zA-Z][a-zA-Z ]+[a-zA-Z]$') && tEntityPerms.length > 0)"
					class="container text-aling-center"
					style="background-color:#f1f1f1"
				>
					<button
						type="button"
						class="addBtn"
						@click="entitys = createEntity(tEntityName.toLowerCase(),tEntityPerms)"
					>Add new Entity</button>
				</div>
			</form>
		</div>
		<div class="margin-top-2">
			<div class="table-container">
				<table>
					<thead>
						<tr>
							<th class="border-bottom-none">Roles</th>
							<th
								class="border-lateral-solid"
								v-for="(entity,index) in entities"
								:key="entity._id"
								:colspan="entity.permissions.length"
								@mouseenter="makeCheckboxVisible(entity._id+index)"
								@mouseleave="makeCheckboxInvisible(entity._id+index)"
								@dblclick="permissions = removeEntity(entity._id,entity.name, entity.permissions)"
							>
								<span title="Double click to remove entity">
									<input
										@click="alternateAllEntityPermissions(entity)"
										:checked="isAllEntityPermissionsAdded(entity)"
										class="tableCheckbox"
										type="checkbox"
										name
										:id="entity._id+index"
									/>
									<label for>{{parseToDisplayFormat(entity.name)}}</label>
								</span>
							</th>
						</tr>
						<tr>
							<th class="border-top-none"></th>
							<th
								class="border-solid"
								v-for="(perm,index) in permissions"
								:key="index"
								@mouseenter="makeCheckboxVisible(perm + index)"
								@mouseleave="makeCheckboxInvisible(perm + index)"
							>
								<input
									type="checkbox"
									class="tableCheckbox"
									:checked="isPermissionInAllRols(perm)"
									name
									:id="perm + index"
									@click="alternatePermissionInAllRols(perm)"
								/>
								<label for>{{parseToDisplayFormat(perm.split(":")[1])}}</label>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(rol,index) in rols" :key="index">
							<td
								@mouseenter="makeCheckboxVisible(rol.name+index)"
								@mouseleave="makeCheckboxInvisible(rol.name+index)"
								@dblclick="removeRol(rol)"
							>
								<input
									@click="alternateAllPermission(rol,permissions)"
									class="tableCheckbox"
									:checked="hasAllpermissions(rol.permissions,permissions)"
									type="checkbox"
									name
									:id="rol.name+index"
								/>

								<span title="Double click to remove rol">
									<label for>{{rol.name}}</label>
								</span>
							</td>
							<td
								v-for="(perm,index) in permissions"
								:key="index"
								@click="rol.permissions = alternatePermission(rol,perm)"
							>
								<div class="text-aling-center">
									<label for v-if="rol.permissions.includes(parseToDBFormat(perm)) == true">X</label>
								</div>
							</td>
						</tr>
					</tbody>
					<tfoot>
						<tr class="display-none" ref="inputTr"></tr>
						<tr ref="addNewRol">
							<td class="success" v-if="flag == true" :colspan="permissions.length + 1" @click="flag = false"><p class="text-aling-center">Add New Rol</p></td>
						</tr>
						<tr v-if="flag == false">
							<td :colspan="permissions.length + 1">
								<div class="flex-container">
									<input
										type="text"
										name
										id
										v-model="tRolName"
										placeholder="New rol"
										@change=" validateStrings(tRolName, '[a-zA-Z][a-zA-Z ]+[a-zA-Z]$', 'warnRolName')"
									/>
									<button
										v-show="!isStringBlank(tRolName) && evaluateRegularExpression(tRolName,'[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')"
										class="addBtn"
										@click="rols = addNewRol(tRolName)"
									>+</button>
								</div>
								<div>
									<div class="text-aling-center">
										<label
											class="visibility-hidden"
											id="warnRolName"
											for
										>Only letters allowed in the permission name</label>
									</div>
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
		<div class="margin-top-1">
			<button class="danger" @click="save()">Save</button>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import RolServices from "../services/rolServices";
import PermissionsServices from "../services/permissionsServices";

export default {
	data() {
		return {
			tRolName: "",
			sEntityName: "",
			sPermName: "",
			tEntityName: "",
			tEntityPerms: "",
			tPermName: "",
			temp: "",
			rols: [],
			permissions: [],
			entities: [],
			error: [],
			test1: [],
			duplicated: [],
			flag: true
		};
	},
	created() {},
	mounted() {
		this.getRols();
		axios
			.get("http://localhost:5000/api/entity/getAll")
			.then(res => {
				this.entities = res.data;
				this.transformEntity(this.entities);
			})
			.catch(err => (this.error = [...this.error, err]));
	},

	methods: {
		removeEntity(id, name, entityPerms) {
			let parsePerms = entityPerms.map(p => name + ":" + p);

			let i = 0;
			while (i < entityPerms.length) {
				this.permissions = this.permissions.filter(pe => pe != parsePerms[i]);
				let j = 0;
				while (j < this.rols.length) {
					this.rols[j].permissions = this.deletePermissionToARol(
						this.rols[j],
						parsePerms[i]
					);
					j += 1;
				}
				i += 1;
			}
			this.entities = this.entities.filter(e => e._id != id);
			axios
				.delete("http://localhost:5000/api/entity/remove/" + id)
				.then()
				.catch(err => (this.error = [...this.error, err]));

			return this.permissions;
		},

		save() {
			axios
				.put("http://localhost:5000/api/roles/save", this.rols)
				.then()
				.catch(err => (this.error = [...this.error, err]));
		},
		listDuplicatedRols() {
			this.openModal("m3");
			axios
				.get("http://localhost:5000/api/roles/duplicateRoles")
				.then(res => (this.duplicated = res.data))
				.catch(err => (this.error = [...this.error, err]));
			//this.duplicated.uniqueIds.[]
		},
		removeRol(rol) {
			this.rols = this.rols.filter(r => r._id != rol._id);
			axios
				.delete("http://localhost:5000/api/roles/remove/" + rol._id)
				.then()
				.catch(err => (this.error = [...this.error, err]));
		},
		addNewRol(name) {
			let perms = this.permissions
				.map(p => this.parseToDBFormat(p))
				.filter(a => a.includes("READ"));
			this.test1 = perms;
			let newRol = this.createNewRol(
				name,
				perms.map(p => this.parseToDBFormat(p))
			);
			axios
				.post("http://localhost:5000/api/roles/create", newRol)
				.then(res =>
					this.rols.push({
						_id: res.data._id,
						name,
						permissions: perms
					})
				)
				.catch(err => (this.error = [...this.error, err]));
			this.flag = true;
			this.tRolName = "";
			return this.rols;
		},
		createNewRol(name, permissions) {
			return {
				name,
				permissions
			};
		},
		getMatchesInPerms() {
			return this.permissions.filter(p =>
				this.parseToDBFormat(p).includes("READ")
			);
		},
		addPermitionToEntity() {
			this.closeModal("m2");
			PermissionsServices.addPermission(
				this.sPermName,
				this.getSelectEntity(this.sEntityName)._id
			);

			this.permissions = [
				...this.permissions,
				this.sEntityName.toLowerCase() + ":" + this.sPermName.toLowerCase()
			];
			this.entities.forEach(item => {
				if (item.name === this.sEntityName) {
					item.permissions.push(this.sPermName);
				}
			});

			this.sEntityName = "";
			this.sPermName = "";
		},
		getSelectEntity(name) {
			return this.entities.filter(e => e.name == name).pop();
		},
		alternatePermissionInAllRols(perm) {
			if (this.isPermissionInAllRols(perm)) {
				this.removePermissionToAllRols(perm);
			} else {
				this.addPermissionToAllRols(perm);
			}
		},

		isPermissionInAllRols(perm) {
			let parsePerm = this.parseToDBFormat(perm);
			let i = 0;
			let is = true;
			while (i < this.rols.length && true) {
				if (!this.hasPermition(this.rols[i].permissions, parsePerm)) {
					is = false;
				}
				i += 1;
			}
			return is;
		},
		removePermissionToAllRols(perm) {
			let parsePerm = this.parseToDBFormat(perm);
			this.rols.forEach(role => {
				if (this.hasPermition(role.permissions, parsePerm)) {
					role.permissions = role.permissions.filter(e => e != parsePerm);
				}
			});
			axios
				.put("http://localhost:5000/api/roles/removePermissionToAllRoles", {
					perm: parsePerm
				})
				.catch(err => (this.error = [...this.error, err]));
		},
		addPermissionToAllRols(perm) {
			let parsePerm = [this.parseToDBFormat(perm)];
			this.rols.forEach(role => {
				role.permissions = [...role.permissions, parsePerm[0]];
			});
			axios
				.put("http://localhost:5000/api/roles/addPermissionToAllRoles", {
					perm: parsePerm[0]
				})
				.catch(err => (this.error = [...this.error, err]));
		},
		isAllEntityPermissionsAdded(entity) {
			let i = 0;
			let all = true;
			while (i < this.rols.length && all) {
				if (
					!this.hasAllpermissions(
						this.rols[i].permissions,
						entity.permissions
							.map(p => entity.name + ":" + p)
							.map(p => this.parseToDBFormat(p))
					)
				) {
					all = false;
				}
				i += 1;
			}
			return all;
		},
		alternateAllEntityPermissions(entity) {
			if (this.isAllEntityPermissionsAdded(entity)) {
				this.deleteAllEntityPermsFromRols(entity);
			} else {
				this.addAllEntityPermissionToAllRol(entity);
			}
		},
		deleteAllEntityPermsFromRols(entity) {
			let i = 0;
			while (i < this.rols.length) {
				let rol = this.rols[i];
				let j = 0;
				while (j < entity.permissions.length) {
					let parsePerm = this.parseToDBFormat(
						entity.name + ":" + entity.permissions[j]
					);
					if (this.hasPermition(rol.permissions, parsePerm)) {
						this.deletePermissionToARol(rol, parsePerm);
					}
					j += 1;
				}
				i += 1;
			}
		},
		addAllEntityPermissionToAllRol(entity) {
			let i = 0;
			while (i < this.rols.length) {
				if (
					!this.hasAllpermissions(
						this.rols[i].permissions,
						entity.permissions
							.map(p => entity.name + ":" + p)
							.map(p => this.parseToDBFormat(p))
					)
				) {
					this.addAllPermissionToARol(
						this.rols[i],
						entity.permissions.map(p => entity.name + ":" + p)
					);
				}
				i += 1;
			}
		},
		alternateAllPermission(rol, perms) {
			if (
				this.hasAllpermissions(
					rol.permissions,
					perms.map(e => this.parseToDBFormat(e))
				)
			) {
				this.removeAllPermission(rol);
			} else {
				this.addAllPermissionToARol(rol, perms);
			}
		},
		removeAllPermission(rol) {
			if (rol.permissions.length > 0) {
				rol.permissions = [];
				axios
					.put(
						"http://localhost:5000/api/roles/removeAllPermissions/" + rol._id
					)
					.catch(err => (this.error = [...this.error, err]));
			}
		},
		addAllArray(a1, a2) {
			let i = 0;
			while (i < a2.length) {
				a1 = [...a1, a2[i]];
				i += 1;
			}
			return a1;
		},
		addAllPermissionToARol(rol, perms) {
			if (perms.length > 0) {
				let parsePerm = perms.map(p => this.parseToDBFormat(p));
				rol.permissions = this.addAllArray(
					rol.permissions,
					parsePerm.filter(p => !rol.permissions.includes(p))
				);
				axios
					.put("http://localhost:5000/api/roles/addPermission/" + rol._id, {
						perm: parsePerm
					})
					.catch(err => (this.error = [...this.error, err]));
			}
		},
		addPermissionToARol(rol, permString) {
			let parsePerm = [this.parseToDBFormat(permString)];
			rol.permissions = [...rol.permissions, parsePerm[0]];
			axios
				.put("http://localhost:5000/api/roles/addPermission/" + rol._id, {
					perm: parsePerm
				})
				.catch(err => (this.error = [...this.error, err]));
			return rol.permissions;
		},
		deletePermissionToARol(rol, permString) {
			this.error = permString;
			let parsePerm = this.parseToDBFormat(permString);
			if (rol.permissions.includes(parsePerm)) {
				rol.permissions = rol.permissions.filter(e => e != parsePerm);
				parsePerm = parsePerm.toUpperCase();
				axios
					.put("http://localhost:5000/api/roles/removePermission/" + rol._id, {
						perm: parsePerm
					})
					.catch(err => (this.error = [...this.error, err.data]));
			}

			return rol.permissions;
		},
		hasAllpermissions(rolPerms, allPerms) {
			let hasAll = true;
			let i = 0;
			while (i < allPerms.length && hasAll) {
				if (!rolPerms.includes(this.parseToDBFormat(allPerms[i]))) {
					hasAll = false;
				}
				i += 1;
			}
			return hasAll;
		},
		hasPermition(rolPerms, perm) {
			let has = false;
			if (rolPerms.includes(perm)) {
				has = true;
			}
			return has;
		},
		alternatePermission(rol, perm) {
			if (this.hasPermition(rol.permissions, this.parseToDBFormat(perm))) {
				rol.permissions = this.deletePermissionToARol(rol, perm);
			} else {
				rol.permissions = this.addPermissionToARol(rol, perm);
			}
			return rol.permissions;
		},
		parseToDBFormat(string) {
			let stringArray = [];
			stringArray = string.split(" ").map(s => s.toUpperCase());
			let parseString = "";
			let i = 0;
			while (i < stringArray.length) {
				parseString = parseString + stringArray[i];
				if (
					i + 1 != stringArray.length &&
					parseString.charAt(parseString.length - 1) != "_"
				) {
					parseString = parseString + "_";
				}
				i += 1;
			}
			return parseString;
		},
		async getRols() {
			try {
				this.rols = await RolServices.getRols();
			} catch (err) {
				this.error = err;
			}
		},
		async createRol(rol) {
			try {
				this.test1 = await RolServices.createRol(rol);
			} catch (err) {
				this.error = err;
			}
		},
		getPermissions() {
			this.permissions = PermissionsServices.getPermissions(this.permissions);
		},
		async addPermissions(perm, id) {
			try {
				this.permissions = await PermissionsServices.addPermission(perm, id);
			} catch (err) {
				this.error = err;
			}
		},
		createEntity(entityName, entityPerms) {
			this.closeModal("id01");
			axios
				.post("http://localhost:5000/api/entity/create/", {
					name: entityName,
					permissions: entityPerms
				})
				.then(res =>
					this.entities.push({
						_id: res.data._id,
						name: entityName,
						permissions: entityPerms
					})
				)
				.catch(err => (this.error = [...this.error, err]));
			if (entityPerms.length > 0) {
				var ep = entityPerms.map(item => entityName + ":" + item);
				this.permissions = this.addAllArray(this.permissions, ep);
			}
			this.tEntityName = "";
			this.tPermName = "";
			this.tEntityPerms = "";
			return this.entities;
		},

		mapToEntityPermsArrays(permsArray) {
			let entityPerms = [];
			let i = 0;
			while (i < permsArray.length) {
				entityPerms = [...entityPerms, permsArray[i].split(":")];
				i += 1;
			}
			this.test1 = 0;
			return entityPerms;
		},
		getEntityObjects(entityPermsArray) {
			let entityObjects = [];
			let id = 0;
			while (entityPermsArray.length > 0) {
				let currentEntity = entityPermsArray[0][0];
				let currentEntityPerms = entityPermsArray
					.filter(e => e[0] == currentEntity)
					.map(e => e[1]);
				entityObjects = [
					...entityObjects,
					this.createEntity("e" + id, currentEntity, currentEntityPerms)
				];
				entityPermsArray = entityPermsArray.filter(e => e[0] != currentEntity);
				id += 1;
			}
			return entityObjects;
		},
		isEntityWithSameName(entityName, permsArray) {
			return permsArray.map(e => e).includes(entityName);
		},
		openModal(id) {
			document.getElementById(id).style.display = "block";
		},
		closeModal(id) {
			document.getElementById(id).style.display = "none";
		},
		addTempPerm(tempEntityPerms, tempPerm) {
			if (!this.isStringBlank(tempPerm)) {
				let parsePerm = this.parseToDisplayFormat(tempPerm);
				tempEntityPerms = [...tempEntityPerms, parsePerm];
				this.tPermName = "";
			}
			return tempEntityPerms;
		},
		parseToDisplayFormat(string) {
			let stringArray = [];
			stringArray = string
				.split("_")
				.map(s => this.firstUpperCaseRestLowerCase(s));
			let parseString = "";
			let i = 0;
			while (i < stringArray.length) {
				parseString = parseString + stringArray[i];
				if (i + 1 != stringArray.length) {
					parseString = parseString + " ";
				}
				i += 1;
			}
			return parseString;
		},
		firstUpperCaseRestLowerCase(string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		},
		isStringBlank(string) {
			let isBlank = true;
			if (string.split("").filter(s => s != " ").length > 0) {
				isBlank = false;
			}
			return isBlank;
		},
		makeCheckboxVisible(checkId) {
			document.getElementById(checkId).style.visibility = "visible";
		},
		makeCheckboxInvisible(checkId) {
			document.getElementById(checkId).style.visibility = "hidden";
		},

		transformEntity(array) {
			const arr = array.map(entity => {
				return entity.permissions.map(permission => {
					return entity.name + ":" + permission;
				});
			});

			this.permissions = arr.reduce((arr1, arr2) => arr1.concat(arr2), []);
		},

		evaluateRegularExpression(string, regularExpressionPattern) {
			let rex = new RegExp(regularExpressionPattern);
			return rex.test(string);
		},
		validateStrings(string, regularExpressionPattern, warningId) {
			let warning = document.getElementById(warningId);
			if (!this.evaluateRegularExpression(string, regularExpressionPattern)) {
				warning.style.visibility = "visible";
				warning.style.color = "red";
			} else {
				warning.style.visibility = "hidden";
			}
		}
	}
};
</script>

<style scoped>
/*-----------------------------table---------------*/
.table-container {
	position: relative;
	max-height: 1080px;
	width: 1080px;
	overflow: scroll;
}

table {
	border-collapse: collapse;
	border-spacing: 0;
	width: 1080px;
	border: 1px solid #ddd;
}
thead {
	background: #91e996;
}
thead th {
	background-color: #91e996;
}
thead tr {
	background-color: #91e996;
}

tbody tr:nth-child(even) {
	background-color: #dddddd;
}

.border-lateral-solid {
	background-color: #91e996;
	text-align: center;
	border: 1px #dddddd;
	border-left-style: solid;
	border-right-style: solid;
}
/*
th span label{
	color: white;
}

th label{
	color: white;
}
*/
th,
td {
	text-align: left;
	padding: 16px;
}

.border-solid {
	text-align: center;
	border-style: solid;
	border: 1px #91e996;
}

.border-bottom-none {
	border: 1px #dddddd;
	border-right-style: solid;
	border-bottom-style: none;
	font-size: 20px;
	text-align: center;
}
.border-top-none {
	border: 1px #dddddd;
	border-top-style: none;
	border-right-style: solid;
}

/*-----------------------------table---------------*/
.visibility-hidden {
	visibility: hidden;
}
.invalid {
	border: 1px solid rgb(253, 3, 3);
}

/*------------------------------------buttons--------------------*/
/* Normal white Button as seen on Google.com*/
.success {background-color: #91e996;} /* Green */
.success:hover {background-color: #46a049;}

.info {background-color: #2196F3;} /* Blue */
.info:hover {background: #0b7dda;}

.warning {background-color: #fac579;} /* Orange */
.warning:hover {background: #e68a00;}

.danger {background-color: #f44336;} /* Red */
.danger:hover {background: #da190b;}

.default {background-color: #e7e7e7; color: black;} /* Gray */
.default:hover {background: #ddd;}
button {
    color: #444444;
    background: #F3F3F3;
    border: 1px #DADADA solid;
    padding: 10px 15px;
    border-radius: 2px;
    font-weight: bold;
    font-size: 12pt;
    outline: none;
}

button:hover {
    border: 1px #C6C6C6 solid;
    box-shadow: 1px 1px 1px #EAEAEA;
    color: #333333;
    background: #F7F7F7;
}

button:active {
    box-shadow: inset 1px 1px 1px #DFDFDF;   
}
/* Blue button as seen on translate.google.com*/
button.blue {
	color: white;
	background: #4c8ffb;
	border: 1px #3079ed solid;
	box-shadow: inset 0 1px 0 #80b0fb;
}

button.blue:hover {
	border: 1px #2f5bb7 solid;
	box-shadow: 0 1px 1px #eaeaea, inset 0 1px 0 #5a94f1;
	background: #3f83f1;
}

button.blue:active {
	box-shadow: inset 0 2px 5px #2370fe;
}

/* Orange button as seen on blogger.com*/
button.orange {
	color: white;
	border: 1px solid #fb8f3d;
	background: -webkit-linear-gradient(top, #fda251, #fb8f3d);
	background: -moz-linear-gradient(top, #fda251, #fb8f3d);
	background: -ms-linear-gradient(top, #fda251, #fb8f3d);
}

button.orange:hover {
	border: 1px solid #eb5200;
	background: -webkit-linear-gradient(top, #fd924c, #f9760b);
	background: -moz-linear-gradient(top, #fd924c, #f9760b);
	background: -ms-linear-gradient(top, #fd924c, #f9760b);
	box-shadow: 0 1px #efefef;
}

button.orange:active {
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.3);
}

/* Red Google Button as seen on drive.google.com */
button.red {
	background: -webkit-linear-gradient(top, #dd4b39, #d14836);
	background: -moz-linear-gradient(top, #dd4b39, #d14836);
	background: -ms-linear-gradient(top, #dd4b39, #d14836);
	border: 1px solid #dd4b39;
	color: white;
	text-shadow: 0 1px 0 #c04131;
}

button.red:hover {
	background: -webkit-linear-gradient(top, #dd4b39, #c53727);
	background: -moz-linear-gradient(top, #dd4b39, #c53727);
	background: -ms-linear-gradient(top, #dd4b39, #c53727);
	border: 1px solid #af301f;
}

button.red:active {
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
	background: -webkit-linear-gradient(top, #d74736, #ad2719);
	background: -moz-linear-gradient(top, #d74736, #ad2719);
	background: -ms-linear-gradient(top, #d74736, #ad2719);
}

/*=======================================*/

body {
	margin: 50px;
}

h1 {
	font: 150%/150% "Freckle Face", cursive;
}

/*--------modal------------*/
.modal-header {
	padding: 2px 16px;
	background-color: #5cb85c;
	color: white;
}
/* Full-width input fields */
input[type="text"],
input[type="password"],
select {
	width: 100%;
	padding: 12px 20px;
	margin: 8px 0;
	display: inline-block;
	border: 1px solid #ccc;
	box-sizing: border-box;
}
span.psw {
	float: right;
	padding-top: 16px;
}

/* The Modal (background) */
.modal {
	display: none; /* Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0, 0, 0); /* Fallback color */
	background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
	padding-top: 60px;
}

/* Modal Content/Box */
.modal-content {
	background-color: #fefefe;
	margin: 5% auto 15% auto; /* 5% from the top, 15% from the bottom and centered */
	border: 1px solid #888;
	width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button (x) */
.close {
	position: absolute;
	right: 25px;
	top: 0;
	color: #000;
	font-size: 35px;
	font-weight: bold;
}
@-webkit-keyframes animatezoom {
	from {
		-webkit-transform: scale(0);
	}
	to {
		-webkit-transform: scale(1);
	}
}

@keyframes animatezoom {
	from {
		transform: scale(0);
	}
	to {
		transform: scale(1);
	}
}

/* Change styles for span and cancel button on extra small screens */
@media screen and (max-width: 300px) {
	span.psw {
		display: block;
		float: none;
	}
	.cancelbtn {
		width: 100%;
	}
}
.animate {
	-webkit-animation: animatezoom 0.6s;
	animation: animatezoom 0.6s;
}

/*----------modal-------------*/
.addBtn {
	background-color: rgb(76, 122, 175);
	color: white;
	padding: 14px 20px;
	margin: 8px 0;
	border: none;
	cursor: pointer;
	width: auto;
}
button:hover {
	opacity: 0.8;
}

.container {
	padding: 16px;
}
.delete-rol {
	float: right;
	right: 25px;
	top: 0;
	color: rgb(100, 99, 99);
	font-size: 20px;
	font-weight: bold;
}

.close:hover,
.close:focus {
	color: red;
	cursor: pointer;
}

.delete-rol:hover,
.cdelete-rol:focus {
	color: red;
	cursor: pointer;
}

/* The Modal (background) */
.modal {
	display: none; /* Hidden by default */
	position: fixed; /* Stay in place */
	z-index: 1; /* Sit on top */
	padding-top: 100px; /* Location of the box */
	left: 0;
	top: 0;
	width: 100%; /* Full width */
	height: 100%; /* Full height */
	overflow: auto; /* Enable scroll if needed */
	background-color: rgb(0, 0, 0); /* Fallback color */
	background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
	position: relative;
	background-color: #fefefe;
	margin: auto;
	padding: 0;
	border: 1px solid #888;
	width: 80%;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
	-webkit-animation-name: animatetop;
	-webkit-animation-duration: 0.4s;
	animation-name: animatetop;
	animation-duration: 0.4s;
}

/* Add Animation */
@-webkit-keyframes animatetop {
	from {
		top: -300px;
		opacity: 0;
	}
	to {
		top: 0;
		opacity: 1;
	}
}

@keyframes animatetop {
	from {
		top: -300px;
		opacity: 0;
	}
	to {
		top: 0;
		opacity: 1;
	}
}

/* The Close Button */
.close {
	color: #000;
	float: right;
	font-size: 28px;
	font-weight: bold;
}

.close:hover,
.close:focus {
	color: #000;
	text-decoration: none;
	cursor: pointer;
}

.modal-header {
	padding: 2px 16px;
	background-color: #5cb85c;
	color: white;
}

.modal-body {
	padding: 2px 16px;
}

.modal-footer {
	padding: 2px 16px;
	background-color: #5cb85c;
	color: white;
}

#myUL {
	/* Remove default list styling */
	list-style-type: none;
	padding: 0;
	margin: 0;
}

#myUL li {
	border: 1px solid #ddd; /* Add a border to all links */
	margin-top: -1px; /* Prevent double borders */
	background-color: #f6f6f6; /* Grey background color */
	padding: 12px; /* Add some padding */
	text-decoration: none; /* Remove default text underline */
	font-size: 18px; /* Increase the font-size */
	color: black; /* Add a black text color */
	display: block; /* Make it into a block element to fill the whole list */
}

.main{
	margin-left: 15%;
}
</style>