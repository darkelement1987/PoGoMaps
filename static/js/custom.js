const motdjmk  = readTextFile("/static/motd.txt?cache="+(Math.random()*1000000));
const motdjmk2 = readTextFile("/static/motd2.txt?cache="+(Math.random()*1000000));

$(function () {
    'use strict'
  
    /* Settings. */

    // What pages should the MOTD be shown on? By default, homepage and mobile
    // pages.
    const motdShowOnPages = [
        '/',
        '/mobile'
    ]

    // Clustering! Different zoom levels for desktop vs mobile.
    const scaleByRarity = false // Enable scaling by rarity. Default: true.
    const upscalePokemon = false // Enable upscaling of certain Pokemon (upscaledPokemon and notify list). Default: false.
    const upscaledPokemon = [] // Add Pokémon IDs separated by commas (e.g. [1, 2, 3]) to upscale icons.

    const disableClusters = Store.get('isClusteringDisabled')
    const maxClusterZoomLevel = 12 // Default: 14  //jmk
    const maxClusterZoomLevelMobile = 20 // Default: same as desktop  //jmk
    const clusterZoomOnClick = false // Default: false
    const clusterZoomOnClickMobile = false // Default: same as desktop
    const clusterGridSize = 60 // Default: 60
    const clusterGridSizeMobile = 60 // Default: same as desktop

    // Process Pokémon in chunks to improve responsiveness.
    const processPokemonChunkSize = 100 // Default: 100
    const processPokemonIntervalMs = 100 // Default: 100ms


    /* Feature detection. */

    const hasStorage = (function () {
        var mod = 'RocketMap'
        try {
            localStorage.setItem(mod, mod)
            localStorage.removeItem(mod)
            return true
        } catch (exception) {
            return false
        }
    }())


    /* Do stuff. */

    const currentPage = window.location.pathname

//jmk
    if (motdShowOnPages.indexOf(currentPage) === -1)
        return;
//jmk
    
    // Set custom Store values.
    Store.set('maxClusterZoomLevel', maxClusterZoomLevel)
    Store.set('clusterZoomOnClick', clusterZoomOnClick)
    Store.set('clusterGridSize', clusterGridSize)
    Store.set('processPokemonChunkSize', processPokemonChunkSize)
    Store.set('processPokemonIntervalMs', processPokemonIntervalMs)
    Store.set('scaleByRarity', scaleByRarity)
    Store.set('upscalePokemon', upscalePokemon)
    Store.set('upscaledPokemon', upscaledPokemon)
    if (typeof window.orientation !== "undefined" || isMobileDevice()) {
        Store.set('maxClusterZoomLevel', maxClusterZoomLevelMobile)
        Store.set('clusterZoomOnClick', clusterZoomOnClickMobile)
        Store.set('clusterGridSize', clusterGridSizeMobile)
    }

    if (disableClusters) {
        Store.set('maxClusterZoomLevel', -1)
    }
   
  
    let motdIsUpdated = true
    let motd2IsUpdated = true

    if (hasStorage) {
        const lastMOTD = window.localStorage.getItem('lastMOTD') || ''
        const lastMOTD2 = window.localStorage.getItem('lastMOTD2') || ''

        if ((lastMOTD === motdjmk) || (motdjmk.length < 10)) {
            motdIsUpdated = false
        } else {
            window.localStorage.setItem('lastMOTD', motdjmk)
        }
        if ((lastMOTD2 === motdjmk2) || (motdjmk2.length < 10)) {
            motd2IsUpdated = false
        } else {
            window.localStorage.setItem('lastMOTD2', motdjmk2)
        }
    }

    if (document.cookie.indexOf('visited=true') == -1) {
       var oneDay = 1000 * 60 * 60 * 24 * 1;
       var oneMin = 1000 * 60
       var expires = new Date((new Date()).valueOf() + oneDay);
       document.cookie = "visited=true;expires=" + expires.toUTCString();
       motdIsUpdated = true
    }

    if ((isMobileDevice() !== true) && (document.cookie.indexOf('visited2=true') == -1)) {
       var oneDay = 1000 * 60 * 60 * 24 * 1;
       var oneHour = 1000 * 60 * 60
       var twoHour = oneHour * 2
       var oneMin = 1000 * 60
       var expires = new Date((new Date()).valueOf() + twoHour);
       document.cookie = "visited2=true;expires=" + expires.toUTCString();
       motdIsUpdated = true
    }

    if (motdIsUpdated) {
       showSplash();
    }
     
    if (motd2IsUpdated) {
       showSplash2();
       var oneDay = 1000 * 60 * 60 * 24 * 1;
       var oneHour = 1000 * 60 * 60
       var oneMin = 1000 * 60
    // motd2 overrides the motd window so this cookie forces the motd to be shown at next hour's refresh
       var expires = new Date((new Date()).valueOf() + oneHour);
       document.cookie = "visited=true;expires=" + expires.toUTCString();
       document.cookie = "visited2=true;expires=" + expires.toUTCString();
    }

     
})
 
  
function showSplash(){

    if (motdjmk.length < 10)  {
        return;
    }
    if (isMobileDevice()) {
        swal({  
          title: '<img src="static/images/pokemap.jpg" width="300">',
          html: '<div style="font-size:0.8em;color: #F00"> ' + motdjmk + ' </div>'
        });
    } else {
        swal({  
          title: '<img src="static/images/pokemap.jpg" width="300">',
          html: '<div style=                "color: #F00"> ' + motdjmk + ' </div>'
        });
    }
}

function showSplash2(){

//    console.log(motdjmk2.length);

    if (motdjmk2.length < 10)  {
        return;
    }
    if (isMobileDevice()) {
        swal({  
          title: '<img src="static/images/pokemap.jpg" width="300">',
          html: '<div style="font-size:0.8em> ' + motdjmk2 + ' </div>'
        });
    } else {
        swal({  
          title: '<img src="static/images/pokemap.jpg" width="300">',
          html: motdjmk2
        });
    }
}

function raidlevel5(){
    Store.set('showRaids', true)
    Store.set('showActiveRaidsOnly', false)
    $('#raids-switch').prop('checked', true)
    $('#raid-active-gym-switch').prop('checked', false)

    Store.set('showRaidMinLevel', "5")
    Store.set('showRaidMaxLevel', "5")
	$("#raid-min-level-only-switch").val("5");
    $('#raid-max-level-only-switch').val("5");
    $('#raids-filter-wrapper').show({'duration': 500})

    Store.set('showPokemon', false)
    Store.set('showPokestops', false)
    Store.set('showGyms', false)
    $('#pokemon-switch').prop('checked', false)
    $('#pokestops-switch').prop('checked', false)
    $('#gyms-switch').prop('checked', false)

//    initSidebar()
    
    lastgyms = false
    updateMap()
    location.reload();

}
    
function raidlevel4(){
    Store.set('showRaids', true)
    Store.set('showActiveRaidsOnly', false)
    $('#raids-switch').prop('checked', true)
    $('#raid-active-gym-switch').prop('checked', false)

    Store.set('showRaidMinLevel', "4")
    Store.set('showRaidMaxLevel', "5")
	$("#raid-min-level-only-switch").val("4");
    $('#raid-max-level-only-switch').val("5");
    $('#raids-filter-wrapper').show({'duration': 500})

    Store.set('showPokemon', false)
    Store.set('showPokestops', false)
    Store.set('showGyms', false)
    $('#pokemon-switch').prop('checked', false)
    $('#pokestops-switch').prop('checked', false)
    $('#gyms-switch').prop('checked', false)

//    initSidebar()
    
    lastgyms = false
    updateMap()
    location.reload();
}
    
   
function presetrares(){
    Store.set('iconSizeModifier', "25");
	$("#pokemon-icon-size").val("25");
    redrawPokemon(mapData.pokemons);
    redrawPokemon(mapData.lurePokemons);
    $selectExclude.val([1,2,4,5,7,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,29,30,32,33,35,37,39,41,42,43,44,46,47,48,49,50,51,52,53,54,56,58,60,61,63,64,66,69,70,72,73,74,75,77,79,81,83,84,85,86,88,90,92,93,95,96,98,99,100,101,102,103,104,105,108,109,110,111,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,132,133,137,138,140,152,153,155,158,161,162,163,164,165,166,167,168,169,170,177,178,182,183,184,185,187,188,190,191,193,194,195,198,200,202,203,204,205,206,207,209,211,213,215,216,217,218,220,221,222,223,224,226,227,228,231,233,234]).trigger('change');
}

function clearfilter(){
    Store.set('iconSizeModifier', "10");
	$("pokemon-icon-size").val("10");
	$selectExclude.val([]).trigger('change');
    redrawPokemon(mapData.pokemons);
    redrawPokemon(mapData.lurePokemons);
}

function readTextFile(file)
{
    var allText = " ";
    var rawFile = new XMLHttpRequest();
    
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
//                alert(allText);
            }
        }
    }

    rawFile.send(null);
//    alert(allText);
//    allText = "hello\nhello\n<u>hello</u>"
    return allText
}

function show_raid(location)
{     
    var locinfo = ['test', 'test']
    
    switch (location) {
        case 'vintage'   : locinfo = ['Vintage Park Raids', 'raid_vintage.txt'      ]; break;
        case 'woodlands' : locinfo = ['The Woodlands',      'raid_woodlands.txt'    ]; break;
        case 'spring'    : locinfo = ['Old Town Spring',    'raid_ots.txt'          ]; break;
        case 'magnolia'  : locinfo = ['Magnolia Raids',     'raid_magnolia.txt'     ]; break;
        case 'galveston' : locinfo = ['Galveston',          'raid_galveston.txt'    ]; break;
        case 'midland'   : locinfo = ['Midland Raids',      'raid_midland.txt'      ]; break;
        case 'jv'        : locinfo = ['Jersey Village',     'raid_jerseyvillage.txt']; break;
        case 'ff'        : locinfo = ['Fairfield Raids',    'raid_fairfield.txt'    ]; break;
        case 'north'     : locinfo = ['North Tomball',      'raid_4corners.txt'     ]; break;
        case 'ttar'      : locinfo = ['Ttar/Machamp',       'raid_ttar_machamp.txt' ]; break;
        case 'legendary' : locinfo = ['Legendary Raids',    'raid_legendary.txt'    ]; break;
        case 'gen3'      : locinfo = ['Gen3 Raid Bosses',   'raid_gen3.txt'         ]; break;
        case 'conroe'    : locinfo = ['Conroe Raids',       'raid_conroe.txt'       ]; break;
        case 'east'      : locinfo = ['East Houston Raids', 'raid_east.txt'         ]; break;
    }
    
    if (isMobileDevice()) {
        swal({  
          title: locinfo[0],
          html: '<div style="font-size:0.7em"> ' + readTextFile("/static/"+locinfo[1]+"?cache="+(Math.random()*1000000)) + ' </div>'
        });
    } else {
        swal({  
          title: locinfo[0],
          html: readTextFile("/static/"+locinfo[1]+"?cache="+(Math.random()*1000000))
        });
    }
}

