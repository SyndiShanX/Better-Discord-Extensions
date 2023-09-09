/**
 * @name MemberCounter
 * @author SyndiShanX, imafrogowo
 * @description Displays the Member Count of a Server at the top of the Member List (Can be Styled using .member-counter-wrapper and .member-counter-text).
 * @version 2.0.4
 * @invite yzYKRKeWNh
 * @source https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/
 * @updateUrl https://github.com/SyndiShanX/Better-Discord-Plugins/blob/main/MemberCounter/MemberCounter.plugin.js
 * @website https://syndishanx.github.io/Better-Discord-Plugins/
 */

const { Webpack: { getModule, getStore }, React, findModuleByProps, Patcher } = BdApi;

class MemberCounter {
  constructor() {
    this.patches = [];
    this.MenuItems = {
      ...getModule((m) => m.MenuRadioItem),
    };
  }
  addPatch(patchType, moduleToPatch, functionName, callback) {
    this.patches.push(
      Patcher[patchType]("MemberCount", moduleToPatch, functionName, callback)
    );
  }
  start() {
    const MemberList = findModuleByProps("ListThin");
    this.addPatch(
      "after",
      MemberList.ListThin,
      "render",
      (SyndiShanXIsAwesome, [args], ret) => {
        const ChannelStore = getStore("ChannelStore")
        const SelectedGuildStore = findModuleByProps("getLastSelectedGuildId");
        const SelectedChannelStore = getStore("SelectedChannelStore").__getLocalVars()
        const MemberCount = findModuleByProps("getMemberCounts").getMemberCount(
          SelectedGuildStore.getGuildId()
        );
        //const UseStateFromStores = getModule(m => m.toString?.().includes("useStateFromStores"));
        const { groups } = getStore("ChannelMemberStore").getProps(
          SelectedGuildStore.getGuildId(),
          SelectedChannelStore.selectedChannelId
        );
        
        const OnlineMembers = groups.filter(group => group.id == "online")[0];
        const ThreadBasedOnlineMembers = ChannelStore.getChannel(SelectedChannelStore.selectedChannelId).memberCount || OnlineMembers?.count;      
        const DMCount = getStore(
          "PrivateChannelSortStore"
        ).getSortedChannels()[1];
        const onlineCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center", marginBottom: "-10px" },
          },
          React.createElement(
            "h1",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: { color: "var(--channels-default)", fontWeight: "bold" },
            },
            `🟢 Online - ${ThreadBasedOnlineMembers}`
          )
        );
        
        const offlineCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center" },
          },
          React.createElement(
            "h1",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: { color: "var(--channels-default)", fontWeight: "bold" },
            },
            `⚫ Offline - ${parseInt(MemberCount) - parseInt(OnlineMembers?.count)}`
          )
        );

        const dmCounter = React.createElement(
          "div",
          {
            className: "member-counter-wrapper",
            style: { textAlign: "center", marginTop: "-20px" },
          },
          React.createElement(
            "h3",
            {
              className:
                "member-counter-text membersGroup-2eiWxl container-q97qHp",
              style: {
                color: "var(--channels-default)",
                fontWeight: "bold",
              },
            },
            `🟢 DMs - ${DMCount?.length}`
          )
        );
        
        const counterWrapper = MemberCount?.toLocaleString() !== undefined ? (
          React.createElement(
            "div",
            null,
            onlineCounter,
            offlineCounter
          )
        ) : (
          React.createElement(
            "div",
            {
              className: "dmcounter-wrapper",
              style: { textAlign: "center" },
            },
            dmCounter
          )
        );

        const children = ret.props.children[0].props.children.props.children;
        children.splice(1, 0, counterWrapper);
        ret.props.children[0].props.children.props.children = children;
      }
    );
  }
  stop() {
    this.patches.forEach((x) => x());
  }
}

module.exports = MemberCounter
