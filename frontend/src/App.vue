<template>
  <div>
    <permissions-manager></permissions-manager>
  </div>
    
</template>

<script>
import permissionsManager  from "./components/permissionsManager_v2.1";
export default {
  components:{
    "permissions-manager":permissionsManager
  }
}
</script>


<style>

.flex-container{
	display: flex;
}
.flex-container-column{
  display: flex;
  flex-direction: column
}
.flex-1{
  flex: 1
}
.flex-2{
  flex: 2
}
.flex-3{
  flex: 3
}
.justify-content-space-between{
  justify-content: space-between;
}
.justify-content-center{
  justify-content: center;
}
.flex-wrap{
  flex-wrap: wrap;
}
html {
  scroll-behavior: smooth;
}
.col-7 {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto auto;
}
.col-5 {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
}

.col-4 {
  display: grid;
  grid-template-columns: auto auto auto auto;
}
.col-3 {
  display: grid;
  grid-template-columns: auto auto auto;
}
.col-2 {
  display: grid;
  grid-template-columns: auto auto;
}
.col-1 {
  display: grid;
  grid-template-columns: auto;
}
.gap-25 {
  column-gap: 25%;
}
.gap-15 {
  column-gap: 15%;
}

.gap-10 {
  column-gap: 10%;
}
.gap-5 {
  column-gap: 5%;
}
.gap-2 {
  column-gap: 2%;
}
.r-gap-2 {
  row-gap: 2%;
}
.r-gap-3 {
  row-gap: 3%;
}
.r-gap-4 {
  row-gap: 4%;
}
.r-gap-5 {
  row-gap: 5%;
}
.padding-top-3 {
  padding-top: 3%;
}
.padding-top-2 {
  padding-top: 2%;
}
.padding-top-1 {
  padding-top: 1%;
}

.padding-bottom-1 {
  padding-bottom: 1%;
}
.padding-left-1 {
  padding-left: 1%;
}
.padding-right-1 {
  padding-right: 1%;
}
.margin-top-1 {
  margin-top: 1%;
}
.margin-top-2 {
  margin-top: 2%;
}
.margin-top-3 {
  margin-top: 3%;
}
.margin-top-4 {
  margin-top: 4%;
}
.margin-top-5 {
  margin-top: 5%;
}
.margin-left-1{
  margin-left: 1%;
}
.text-aling-center {
  text-align: center;
}
.text-aling-rigth {
  text-align: right;
}
.text-aling-left {
  text-align: left;
}
.font-size-19px {
  font-size: 19px;
}
.float-left{
  float: left;
}

.subsection {
  margin-top: 5px;
}



textarea {
  width: 100%;
  height: 150px;
  padding: 5px 5px;
  margin: 3px 0px 10px 0px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  font-size: 19px;
}
.margin-top-5 {
  margin-top: 5%;
}
.alert {
  margin-top: 1%;
  padding: 20px;
  background-color: #f44336; /* Red */
  color: white;
  margin-bottom: 15px;
  display: none;
}


/* The alert message box */
.alert {
  margin-top: 5%;
  padding: 20px;
  background-color: #f44336; /* Red */
  color: white;
  margin-bottom: 15px;
  display: none;
}

/* The close button */
.closebtn {
  margin-left: 15px;
  color: white;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}

/* When moving the mouse over the close button */
.closebtn:hover {
  color: black;
}
.obligatory-field {
  color: red;
}
</style>
