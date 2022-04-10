RegisterNetEvent('ez-projector:server:project-start')
RegisterNetEvent('ez-projector:server:project-stop')
on('ez-projector:server:project-start', function (event) {
  emitNet('ez-projector:client:project-start', -1, event)
})

on('ez-projector:server:project-stop', function () {
  emitNet('ez-projector:client:project-stop', -1)
})
