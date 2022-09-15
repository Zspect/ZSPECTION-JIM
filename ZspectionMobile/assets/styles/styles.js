import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#28558E';
const WHITE_COLOR = 'white';
const BLACK_COLOR = 'black';
const GREY_COLOR = '#808080';

var styles = StyleSheet.create({
  splash: {
    width: '100%',
    height: '100%',
  },
  imageThumbnail:{
    borderWidth:1,
    width:'100%',
    flex:1,
  },
  container: {

  },
  loginTopContainer:{
    height:300,
    backgroundColor:PRIMARY_COLOR,
  },
  loginBottomContainer:{
    flex:1,
  },
  loginSearchIconWrapper: {
    paddingVertical: 25,
    alignItems:'center',
    justifyContent:'center',
  },
  loginFooter: {
    paddingTop:150,
  },
  loginCardContainer: {
    position: 'absolute',
    width:'100%',
    top: '17%',
    alignItems:'center',
    justifyContent:'center',
    zIndex:1,
  },
  loginCheckbox: {
    borderColor:'#ccc',
    borderWidth:1,
  },
  loginCard: {
    position:'relative',
    width:'90%',
    borderRadius:10,
    alignItems:'center',
  },
  loginCardWraper: {
    paddingRight: 15,
  },
  loginTextWrapper: {
    borderBottomWidth:1.5,
    borderBottomColor: PRIMARY_COLOR,
    alignItems:'center',
    width:60,
    marginVertical: 20,
    paddingBottom:2,
  },
  wid100: {
    width: '100%',
  },
  center:{
    alignItems:'center',
  },
  centers:{
    alignItems:'center',
    marginTop:50
  },
  loginText: {
    fontSize:16,
    color:BLACK_COLOR,
  },
  font14: {
    fontSize:14,
  },
  font15: {
    fontSize:15,
    paddingLeft:0,
  },
  font16: {
    fontSize:16,
  },
  rememberAndForgotWrapper: {
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:25,
    marginBottom:5,
  },
  greyColor:{
    color:GREY_COLOR,
  },
  loginButtonWrapper: {

  },
  textCenter: {
    textAlign:'center',
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius:10,
    paddingHorizontal:30,
    marginVertical: 20,
    height:35,
  },
  formItem: {
    borderColor: GREY_COLOR,
  },
  orWrapper: {
    marginVertical:20,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  orLine: {
    backgroundColor:PRIMARY_COLOR,
    height:1,
    width:'40%',
  },
  orTextContainer: {
    marginHorizontal: 5,
  },
  loginWithStyle: {
    textAlign:'center',
    color: PRIMARY_COLOR,
    fontWeight: "bold",
  },
  socialWrapper: {
    flexDirection:'row',
    alignItems:'center',
    marginVertical:15,
    justifyContent:'center',
  },
  loginSocialImage: {
    marginHorizontal: 5,
  },
  primaryColor: {
    color: PRIMARY_COLOR,
  },
  newUserWrapper: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold'
  },
  loginContainerStyle: {paddingTop:0, marginRight:3, paddingRight:0, paddingLeft:3,marginTop:3},

  //Register page style
  registerFormContainer: {
    paddingLeft:10,
    paddingRight:30,
    overflow:'hidden',
  },
  registerImageContainer: {
    alignItems:'center',
    marginVertical:20,
  },
  twoRow: {
    flexDirection: 'row',
    flex:1,
    justifyContent:'center',
  },
  thriceRow: {
    width:'29%'
  },
  halfRow: {
    width:"46%",
  },
  registerOtherComponents:{paddingTop:12,borderBottomWidth:0,width:'100%'},
  registerOtherComponentsText:{
    color: GREY_COLOR,
    fontWeight:"500",
    fontSize:16,
  },
  errorContainer: {
    backgroundColor:'#CA3433',
    margin:10,
  },
  error:{
    color: WHITE_COLOR,
    paddingHorizontal:10,
    paddingVertical:3,
  },
  white: {
    color: WHITE_COLOR
  }, 
  //Landing page Style
  homeContainer:{
    flex:1,
  },
  homeLogoWrapper: {
    alignItems:'center',
    height:'20%',
    justifyContent:'center',
    flex:1,
  },
  homeMiddleWrapper: {
    flex:2,
    justifyContent:'center',
  },
  homeBottomWrapper: {
    justifyContent:'space-between',
    flexDirection:'row',
    
  },
  homeBlueWrapper: {
    backgroundColor: PRIMARY_COLOR,
    alignItems:'center',
    justifyContent:'center',
    paddingVertical: 12,

  },
  homeAreText: {
    color: WHITE_COLOR,
    fontSize:23,
    fontWeight: 'bold',
  },
  
  bottomRoleContainer: {
    backgroundColor: PRIMARY_COLOR,
    alignItems:'center',
    width: '32%',
    height: 130,
  },
  bottomText: {
    color: WHITE_COLOR,
    textAlign:'center',
  },
  bottomImage: {
    position: 'relative',
    bottom: 25,
  },

  // Real Estate pages
  advertisementSpace: {
    height:45,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'orange',
  },
  advertisementSpaces: {
    height:35,
    marginTop:10,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:PRIMARY_COLOR,
  },
  inspectionRequestFormContainer: {
    paddingLeft:10,
    paddingRight:30,
    overflow:'hidden',
  },
  dateInput:{
    alignItems: 'flex-start',
    paddingLeft:30,
    borderWidth:0,
  },
  dateText:{
     
  },
  dateIcon: {
    position:'absolute',
    left:0,
    
  },

  bottomRoleContainers: {
    backgroundColor: PRIMARY_COLOR,
    alignItems:'center',
    width: '19%',
    height: 60,
  }, 

  homeBottomWrappers: {
    justifyContent:'space-around',
    flexDirection:'row',
    
  },
  bottomText: {
    color: WHITE_COLOR,
    textAlign:'center',
    fontSize:12
  },
  icon:{
    height: 20,
    width: 20, 
    marginVertical:7
  },
  icons:{
    height: 15,
    width: 15, 
    marginLeft:10
  },
  followButton: {
    marginTop:10,
    marginBottom:60,
    height:35,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center',
    borderRadius:10,
    backgroundColor: PRIMARY_COLOR
  },
  followButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },



  /* Company details */
  homeContainers:{
    flex:1,
    justifyContent:'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    padding: 6,
    paddingRight:5,
    justifyContent: 'space-between',

  },
  rows: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    //padding: 6,
    justifyContent: 'space-between',
    paddingLeft:10,
    paddingRight:30,
    overflow:'hidden',
    marginTop:10

  },
  pic: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
  },
  nameContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  nameTxt: {
    fontWeight: '600',
    color: '#222',
    fontSize: 14,

  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  end: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  icon:{
    height: 18,
    width: 18, 
  },
  date:{
    fontSize:13,
  },
  time:{
    fontSize:13,
    marginRight:60
  },
  card:{
    backgroundColor: "#FFFFFF",
    borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  
  

});

module.exports = styles;