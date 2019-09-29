const request = require("request");
const allChannels = `[{"channelId":"260813553"},{"channelId":"35986719"},{"channelId":"141759738"},{"channelId":"78057752"},{"channelId":"140056453"},{"channelId":"50292615"},{"channelId":"14947269"},{"channelId":"156237140"},{"channelId":"273204746"},{"channelId":"124568560"},{"channelId":"29279425"},{"channelId":"23700366"},{"channelId":"151046563"},{"channelId":"240856938"},{"channelId":"100413671"},{"channelId":"85162126"},{"channelId":"259010244"},{"channelId":"49407549"},{"channelId":"51199303"},{"channelId":"84143588"},{"channelId":"90750495"},{"channelId":"214543480"},{"channelId":"168623127"},{"channelId":"164235296"},{"channelId":"59589169"},{"channelId":"75021520"},{"channelId":"122874870"},{"channelId":"120162060"},{"channelId":"104790620"},{"channelId":"110516321"},{"channelId":"202793325"},{"channelId":"154895831"},{"channelId":"173891296"},{"channelId":"156935325"},{"channelId":"215647942"},{"channelId":"70581143"},{"channelId":"51233469"},{"channelId":"190847701"},{"channelId":"71789054"},{"channelId":"85339732"},{"channelId":"143291972"},{"channelId":"195298376"},{"channelId":"39762274"},{"channelId":"100512435"},{"channelId":"140596320"},{"channelId":"24565497"},{"channelId":"98307922"},{"channelId":"41456687"},{"channelId":"90433413"},{"channelId":"71711588"},{"channelId":"171807926"},{"channelId":"138281255"},{"channelId":"77960152"},{"channelId":"31850031"},{"channelId":"69055817"},{"channelId":"73950529"},{"channelId":"142057113"},{"channelId":"55128677"},{"channelId":"27915449"},{"channelId":"264113438"},{"channelId":"134684464"},{"channelId":"211168055"},{"channelId":"115296013"},{"channelId":"123948038"},{"channelId":"93470323"},{"channelId":"159707575"},{"channelId":"41036757"},{"channelId":"151702774"},{"channelId":"104512914"},{"channelId":"234872330"},{"channelId":"31380848"},{"channelId":"66597091"},{"channelId":"256848376"},{"channelId":"280549921"},{"channelId":"113137834"},{"channelId":"36416858"},{"channelId":"151035621"},{"channelId":"40742756"},{"channelId":"119467976"},{"channelId":"241747716"},{"channelId":"97240661"},{"channelId":"43003065"},{"channelId":"23653919"},{"channelId":"52236420"},{"channelId":"107787585"},{"channelId":"112399445"},{"channelId":"70950300"},{"channelId":"41706792"},{"channelId":"52494203"},{"channelId":"256076961"},{"channelId":"221628924"},{"channelId":"140495777"},{"channelId":"196241320"},{"channelId":"203233216"},{"channelId":"145089315"},{"channelId":"141413227"},{"channelId":"40781152"},{"channelId":"118849465"},{"channelId":"125904299"},{"channelId":"191061587"},{"channelId":"102246244"},{"channelId":"253389140"},{"channelId":"209985250"},{"channelId":"194483790"},{"channelId":"45901317"},{"channelId":"274648919"},{"channelId":"160688458"},{"channelId":"121830523"},{"channelId":"51606770"},{"channelId":"59444366"},{"channelId":"159538289"},{"channelId":"260696195"},{"channelId":"234914040"},{"channelId":"50334563"},{"channelId":"221093761"},{"channelId":"25410847"},{"channelId":"1476594"},{"channelId":"29471429"},{"channelId":"187708020"},{"channelId":"68562665"},{"channelId":"278024493"},{"channelId":"150468988"},{"channelId":"208346385"},{"channelId":"131594760"},{"channelId":"43870768"},{"channelId":"124722638"},{"channelId":"55347714"},{"channelId":"38840962"},{"channelId":"229806095"},{"channelId":"75857464"},{"channelId":"36231627"},{"channelId":"92768660"},{"channelId":"166080266"},{"channelId":"186326796"},{"channelId":"177850402"},{"channelId":"183545680"},{"channelId":"44331647"},{"channelId":"177061618"},{"channelId":"99840550"},{"channelId":"177014062"},{"channelId":"93207130"},{"channelId":"170779794"},{"channelId":"211472923"},{"channelId":"273170881"},{"channelId":"110131539"},{"channelId":"134994367"},{"channelId":"159904102"},{"channelId":"184821677"},{"channelId":"148070539"},{"channelId":"24183272"},{"channelId":"231030652"},{"channelId":"153853006"},{"channelId":"246411810"},{"channelId":"246225440"},{"channelId":"128818781"},{"channelId":"104800265"},{"channelId":"233087728"},{"channelId":"112687014"},{"channelId":"134186801"},{"channelId":"273522046"},{"channelId":"54740205"},{"channelId":"122833048"},{"channelId":"186356129"},{"channelId":"24809696"},{"channelId":"170698420"},{"channelId":"62199359"},{"channelId":"156059395"},{"channelId":"142760901"},{"channelId":"134214209"},{"channelId":"167670317"},{"channelId":"207129018"},{"channelId":"92725766"},{"channelId":"41111186"},{"channelId":"174186805"},{"channelId":"79954546"},{"channelId":"107107518"},{"channelId":"255976491"},{"channelId":"135159435"},{"channelId":"202020657"},{"channelId":"148931946"},{"channelId":"154379127"},{"channelId":"97908269"},{"channelId":"61761549"},{"channelId":"177769463"},{"channelId":"51900807"},{"channelId":"197005908"},{"channelId":"40470645"},{"channelId":"40478758"},{"channelId":"199330709"},{"channelId":"95123999"},{"channelId":"231629115"},{"channelId":"211986779"},{"channelId":"144939628"},{"channelId":"154285222"},{"channelId":"176096874"},{"channelId":"127324774"},{"channelId":"203613251"},{"channelId":"46712604"},{"channelId":"68337961"},{"channelId":"229703045"},{"channelId":"201430254"},{"channelId":"124641295"},{"channelId":"122163686"},{"channelId":"192334631"},{"channelId":"231089942"},{"channelId":"181479176"},{"channelId":"41906782"},{"channelId":"184167435"},{"channelId":"174822147"},{"channelId":"158571865"},{"channelId":"99439207"},{"channelId":"243876739"},{"channelId":"140748873"},{"channelId":"88556698"},{"channelId":"236044842"},{"channelId":"122181552"},{"channelId":"177855965"},{"channelId":"59196455"},{"channelId":"143216841"},{"channelId":"160359087"},{"channelId":"199764836"},{"channelId":"196188064"},{"channelId":"213386297"},{"channelId":"161337469"},{"channelId":"79159830"},{"channelId":"164441322"},{"channelId":"154240307"},{"channelId":"209594991"},{"channelId":"161576298"},{"channelId":"245459399"},{"channelId":"185648250"},{"channelId":"182348544"},{"channelId":"278404770"},{"channelId":"161625494"},{"channelId":"144080003"},{"channelId":"104297150"},{"channelId":"53457881"},{"channelId":"100042218"},{"channelId":"150602464"},{"channelId":"215287318"},{"channelId":"728986"},{"channelId":"131875345"},{"channelId":"150355355"},{"channelId":"212070941"},{"channelId":"104225651"},{"channelId":"157972586"},{"channelId":"82302699"},{"channelId":"72196584"},{"channelId":"133022070"},{"channelId":"218019267"},{"channelId":"107448887"},{"channelId":"75889013"},{"channelId":"114008244"},{"channelId":"57021520"},{"channelId":"91831612"},{"channelId":"104375529"},{"channelId":"49234928"},{"channelId":"216667899"},{"channelId":"207452783"},{"channelId":"236721868"},{"channelId":"274169998"},{"channelId":"187200543"},{"channelId":"236253469"},{"channelId":"118277609"},{"channelId":"131639423"},{"channelId":"117382115"},{"channelId":"126838229"},{"channelId":"26380843"},{"channelId":"108899986"},{"channelId":"151220634"},{"channelId":"141794876"},{"channelId":"35065367"},{"channelId":"36810247"},{"channelId":"227277567"},{"channelId":"137696373"},{"channelId":"167650289"},{"channelId":"144522361"},{"channelId":"55450210"},{"channelId":"217300853"},{"channelId":"225836349"},{"channelId":"195760636"},{"channelId":"51615532"},{"channelId":"206808371"},{"channelId":"54345555"},{"channelId":"57108287"},{"channelId":"193726398"},{"channelId":"48898826"},{"channelId":"26805012"},{"channelId":"245055870"},{"channelId":"52000734"},{"channelId":"153956436"},{"channelId":"36797495"},{"channelId":"49013414"},{"channelId":"49114511"},{"channelId":"39767206"},{"channelId":"155658639"},{"channelId":"145193284"},{"channelId":"47964755"},{"channelId":"129127679"},{"channelId":"114983966"},{"channelId":"159210094"},{"channelId":"77615539"},{"channelId":"186273527"},{"channelId":"161792463"},{"channelId":"252085721"},{"channelId":"131313773"},{"channelId":"146739091"},{"channelId":"117351355"},{"channelId":"27947877"},{"channelId":"274819286"},{"channelId":"63206144"},{"channelId":"176047295"},{"channelId":"92958814"},{"channelId":"31621071"},{"channelId":"45666218"},{"channelId":"207293854"},{"channelId":"147954512"},{"channelId":"94413935"},{"channelId":"52381902"},{"channelId":"43476050"},{"channelId":"168613442"},{"channelId":"188864087"},{"channelId":"39772257"},{"channelId":"91047243"},{"channelId":"61024420"},{"channelId":"147747815"},{"channelId":"130852758"},{"channelId":"144858014"},{"channelId":"106992019"},{"channelId":"54487173"},{"channelId":"197293273"},{"channelId":"165737420"},{"channelId":"9540056"},{"channelId":"254372688"},{"channelId":"78555350"},{"channelId":"209319891"},{"channelId":"262136365"},{"channelId":"147131375"},{"channelId":"212565370"},{"channelId":"66522745"}]`

async function getChannelIds() {
    return new Promise((resolve, reject) => {
        request(
            `https://twitch.blerp.com/channels/live`,
            {
              method: "GET"
            },
            (err, res) => {
                resolve(JSON.parse(res.body))
            }
          );
    })
  }

  getChannelIds().then((items) => {
    // const channelIds = channelIdList.join(",")
    // curl -H 'Accept: application/vnd.twitchtv.v5+json' \
    // -H 'Client-ID: oafn7vvzfyzyccwrwrt233221oe5wq' \
    // -X GET 'https://api.twitch.tv/kraken/channels/419661866'
    const channelIdList = items.map((channel) => {
        return channel.channelId
    })

    const urls = channelIdList.map(async (id) => {
        return await getChannelObjects(id)
    })

    Promise.all(urls).then(values => {
        console.log(values)
    })
  })

async function getChannelObjects(id) {
    // Set the HTTP headers required by the Twitch API.
    const headers = {
      "Client-ID": "oafn7vvzfyzyccwrwrt233221oe5wq",
      "Accept": "application/vnd.twitchtv.v5+json"
    };

    return new Promise((resolve, reject) => {
        request(
            `https://api.twitch.tv/kraken/channels/${id}`,
            {
              method: "GET",
              headers
            },
            (err, res) => {
                // console.log("URL:", JSON.parse(res.body))
                resolve({url: JSON.parse(res.body).url, id: JSON.parse(res.body)._id})
            }
          );
    })
  }
