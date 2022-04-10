const projectorPos = [439.4834606, -987.31636962, 36.880146179] // MRPD board

async function loadScaleform(scaleform) {
  let scaleformHandle = RequestScaleformMovie(scaleform)

  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (HasScaleformMovieLoaded(scaleformHandle)) {
        clearInterval(interval)
        resolve(scaleformHandle)
      } else {
        scaleformHandle = RequestScaleformMovie(scaleform)
      }
    }, 0)
  })
}

const url = 'https://i.imgur.com/Jhh0Apl.png' // Lighthouse eft map :)
const scale = 0.1
const sfName = 'generic_texture_renderer'

const width = 1550
const height = 960

let sfHandle = null
let txdHasBeenSet = false
let duiObj = null
let currentUrl = null
let isPlaying = false

setTick(async () => {
  if (sfHandle !== null && !txdHasBeenSet) {
    PushScaleformMovieFunction(sfHandle, 'SET_TEXTURE')

    PushScaleformMovieMethodParameterString('meows') // txd
    PushScaleformMovieMethodParameterString('woof') // txn

    PushScaleformMovieFunctionParameterInt(0) // x
    PushScaleformMovieFunctionParameterInt(0) // y
    PushScaleformMovieFunctionParameterInt(width)
    PushScaleformMovieFunctionParameterInt(height)

    PopScaleformMovieFunctionVoid()

    txdHasBeenSet = true
  }

  if (currentUrl) {
    const playerCoords = GetEntityCoords(PlayerPedId())
    if (
      GetDistanceBetweenCoords(
        playerCoords[0],
        playerCoords[1],
        playerCoords[2],
        projectorPos[0],
        projectorPos[1],
        projectorPos[2],
      ) <= 12.0
    ) {
      if (!isPlaying) {
        await taskPlayUrl(currentUrl)
      }
    } else {
      CleanupDUI()
    }
  }

  if (sfHandle !== null && HasScaleformMovieLoaded(sfHandle)) {
    DrawScaleformMovie_3dNonAdditive(
      sfHandle,
      projectorPos[0],
      projectorPos[1],
      projectorPos[2],
      0,
      0,
      -90,
      2,
      2,
      2,
      scale * 1,
      scale * (9 / 16),
      1,
      2,
    )
  }
})

on('ez-projector:client:project', async () => {
  const keyboard = await exports['qb-input'].ShowInput({
    header: 'Projector',
    inputs: [
      {
        text: 'Load URL',
        name: 'link',
        type: 'text',
        isRequired: true,
        default: 'https://',
      },
    ],
  })

  if (keyboard.link) emitNet('ez-projector:server:project-start', keyboard.link)
})
on('ez-projector:client:project-clear', () => {
  emitNet('ez-projector:server:project-stop')
})

RegisterNetEvent('ez-projector:client:project-start')
RegisterNetEvent('ez-projector:client:project-stop')
on('ez-projector:client:project-start', async (link) => {
  if (currentUrl) CleanupDUI()
  currentUrl = link

  await taskPlayUrl(link)
})
on('ez-projector:client:project-stop', () => {
  currentUrl = null
  CleanupDUI()
})

const taskPlayUrl = async (link) => {
  isPlaying = true
  sfHandle = await loadScaleform(sfName)

  runtimeTxd = 'meows'

  const txd = CreateRuntimeTxd('meows')
  duiObj = CreateDui(link, width, height)
  const dui = GetDuiHandle(duiObj)
  const tx = CreateRuntimeTextureFromDuiHandle(txd, 'woof', dui)
}

on('QBCore:Client:OnPlayerLoaded', () => {
  SetupQbTarget()
})

on('onClientResourceStart', async (resName) => {
  if (resName === GetCurrentResourceName()) {
    SetupQbTarget()
  }
})

on('onResourceStop', (resName) => {
  if (resName === GetCurrentResourceName()) {
    CleanupDUI()
  }
})

const SetupQbTarget = () => {
  exports['qb-target'].AddTargetModel(GetHashKey('p_planning_board_02'), {
    options: [
      {
        event: 'ez-projector:client:project',
        icon: 'fas fa-display',
        label: 'Use Projector',
      },
      {
        event: 'ez-projector:client:project-clear',
        icon: 'fas fa-power-off',
        label: 'Power off',
      },
    ],
    job: ['all'],
    distance: 2.0,
  })
}

const CleanupDUI = () => {
  if (duiObj) {
    DestroyDui(duiObj)
    SetScaleformMovieAsNoLongerNeeded(0)
    duiObj = null
    txdHasBeenSet = false
    sfHandle = null
    isPlaying = false
  }
}
