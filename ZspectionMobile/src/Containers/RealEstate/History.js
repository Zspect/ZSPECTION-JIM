import React, { Component, useEffect } from 'react';
import { Container, Tab, Tabs, ScrollableTab } from 'native-base';
import Upcoming from '../RealEstate/HistoryList/Upcoming';
import Past from '../RealEstate/HistoryList/Past';
import Toolbar from '../../Components/Toolbar';
import strings from '../../utils/strings';

const History = (props) => {

  return (
    <Container>
      <Toolbar
        title={strings.history}
        onCallbackPress={() => props.navigation.toggleDrawer()}
      />
      <Tabs tabBarUnderlineStyle={{ backgroundColor: '#b3003b' }} tabBarBackgroundColor='white' renderTabBar={() => <ScrollableTab />}>
        <Tab heading="Upcoming" activeTabStyle={{ backgroundColor: "#b3003b", width: '50%' }} tabStyle={{ width: '50%', backgroundColor: '#28558E' }}>
          <Upcoming
            props={props}
          />
        </Tab>
        <Tab heading="Past" activeTabStyle={{ backgroundColor: "#b3003b", width: '50%' }} tabStyle={{ width: '50%', backgroundColor: '#28558E' }}>
          <Past
            props={props}
          />
        </Tab>
      </Tabs>
    </Container>
  );
}
export default History;

// export default class History extends Component {
//   render() {
//     return (
//       <Container>
//         <Tabs tabBarUnderlineStyle={{ backgroundColor: '#b3003b' }} tabBarBackgroundColor='white' renderTabBar={() => <ScrollableTab />}>
//           <Tab heading="Upcoming" activeTabStyle={{ backgroundColor: "#b3003b", width: '50%' }} tabStyle={{ width: '50%', backgroundColor: '#28558E' }}>
//             <Upcoming />
//           </Tab>
//           <Tab heading="Past" activeTabStyle={{ backgroundColor: "#b3003b", width: '50%' }} tabStyle={{ width: '50%', backgroundColor: '#28558E' }}>
//             <Past />
//           </Tab>
//         </Tabs>
//       </Container>
//     );
//   }
// }