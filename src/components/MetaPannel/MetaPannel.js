import React from "react";
import { Segment, Accordion, Header, Icon } from "semantic-ui-react";

class MetaPannel extends React.Component {
  state = {
    activeIndex: 0
  };
  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = (activeIndex = index ? -1 : index);
    this.setState({ activeIndex: newIndex });
  };
  render() {
    const { activeIndex } = this.state;
    return (
      <Segment>
        <Header as="h3" attached="top">
          About # Channel
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            chanel details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            details
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            posters
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            Creator
          </Accordion.Content>
        </Accordion>
      </Segment>
    );
  }
}

export default MetaPannel;
