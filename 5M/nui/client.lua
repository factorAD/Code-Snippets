local isDisplayed = true

RegisterCommand('testNUI', function()

    SendNUIMessage({
        nui_reference = 'example',
        data = {
            display = true
        }
    })

end)


    CreateThread(function()

        while isDisplayed do

            if IsControlJustPressed(0, 38) or IsDisabledControlJustPressed(0, 38) then
                SendNUIMessage({
                    nui_reference = 'example',
                    data = {
                        display = false
                    }
                })

                isDisplayed = false
            end

            if not isDisplayed then
                isDisplayed = true
            end
            Wait(0)
        end
    end)
