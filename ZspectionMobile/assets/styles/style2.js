import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#28558E';
const WHITE_COLOR = 'white';
const BLACK_COLOR = 'black';
const GREY_COLOR = '#808080';

var styles = StyleSheet.create({
    registerImageContainer: {
        alignItems:'center',
        marginVertical:20,
      },
      container: {
        marginHorizontal:15,
        // borderWidth:1,
        // borderColor:'red',
      },
      formItem: {
        borderColor: '#FFF',
        borderWidth:0,
      },
        heading: {
          color: PRIMARY_COLOR,
          fontWeight:'bold',
          margin: 10,
        },
        heading2: {
          color: PRIMARY_COLOR,
          fontWeight:'bold',
          fontSize:18,
          
        },
        heading3: {
          justifyContent:'center',
          alignItems:'center',
          alignSelf:'center',
          color:'gray',
          fontSize:12,
        },
      registerFormContainer: {
        paddingLeft:10,
        paddingBottom:20,
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
        justifyContent:'space-between'
      },
      sectionRow:{
        flexDirection:'row',
      },
      threeRow: {
        flex:1,
      },  
      sectionColumn: {
        flex:1,
        marginHorizontal:10,
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        
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
      center:{
        alignItems:'flex-end',
        paddingRight:10
      },
      centers:{
        alignItems:'center',
      },
      borderNone: {
        borderWidth:0,
        borderColor:'#FFF'
      },
      flatListItem: {
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        paddingVertical:10,
        paddingLeft:10,
      },
      flatListItemTextRow: {
        marginLeft:10,
        flex:1,
      },
      matrixRow: {
        
        borderWidth:2,
        flex:1,
        justifyContent:'space-between'
      },
      sectionColumnMatrix:{
        flex:1,
      },
      matrixInput1: {
        borderBottomWidth:1,
        borderBottomColor:'#ccc',
        width:60,
        textAlign:'center',
        paddingBottom:12,
        color:'gray'
      },
      matrixNumber:{
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:15,
        
      },
      matrixInput2:{
        borderBottomWidth:3,
        borderBottomColor:'#ccc'
      },
      sectionMatrixRow: {
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:5,
        marginVertical:10,
      },
      sectionMatrixRow2: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"space-around"
      },
      dash:{backgroundColor:'#ccc',width:15,height:2},
      addMore:{
        color:PRIMARY_COLOR,
        textAlign:'right'
      },
      registerOtherComponents:{
        paddingLeft:10,
        paddingTop:15,
      },
      registerOtherComponentsText:{
        color: GREY_COLOR,
        fontWeight:"500",
        fontSize:16,
      },
      loginButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius:10,
        paddingHorizontal:20,
        marginVertical: 20,
        height:35,
      },
      textCenter: {
        textAlign:'center',
      },
      border:{
        borderBottomColor:'#ccc',borderBottomWidth:1,
        marginHorizontal:10,
      },
});

module.exports = styles;