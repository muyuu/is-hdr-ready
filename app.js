let mc = {
    videoConfiguration : new Object(),

    tryit: function () {
        mc.createConfiguration();
        mc.testit();
    },

    createConfiguration: function () {
        var size = document.getElementById('size').value.split('x');
        const hdrMetadataType = document.getElementById('hdrMetadataType').value;
        const colorGamut = document.getElementById('colorGamut').value;
        const transferFunction = document.getElementById('transferFunction').value;
        mc.videoConfiguration = {
            type: 'file',
            video: {
                contentType: document.getElementById('codec').value,
                width: size[0],
                height: size[1],
                bitrate: document.getElementById('bitrate').value,
                framerate: document.getElementById('framerate').value,
                hdrMetadataType: hdrMetadataType === 'unset' ? undefined : hdrMetadataType,
                colorGamut: colorGamut === 'unset' ? undefined : colorGamut,
                transferFunction: transferFunction === 'unset' ? undefined : transferFunction,
            }
        }
    },

    testit: function () {
        console.log(mc.videoConfiguration);
        navigator.mediaCapabilities.decodingInfo(mc.videoConfiguration).then(result => {
            var tr = document.createElement('tr');
            var mcv = mc.videoConfiguration.video;

            let content = '';
            content += `<td>${mcv.contentType}</td>`;
            content += `<td>${mcv.width} * ${mcv.height}</td>`;
            content += `<td>${mcv.framerate}</td>`;
            content += `<td>${mcv.bitrate}</td>`;
            content += `<td>${mcv.transferFunction === undefined ? '-' : mcv.transferFunction}</td>`;
            content += `<td>${mcv.colorGamut === undefined ? '-' : mcv.colorGamut}</td>`;
            content += `<td>${mcv.hdrMetadataType === undefined ? '-' : mcv.hdrMetadataType}</td>`;
            content += `<td>${result.supported ? '⭕️' : '❎'}</td>`;
            content += `<td>${result.smooth ?  '⭕️' : '❎'}</td>`;
            content += `<td>${result.powerEfficient ?  '⭕️' : '❎'}</td>`;

            var table = document.getElementById("results")
            tr.innerHTML = content;
            table.appendChild(tr);
        }).catch((error) => {
            var tr = document.createElement('tr');
            var table = document.getElementById("results");
            tr.innerHTML = '<td colspan="9">Codec ' + mc.videoConfiguration.video.contentType + ' threw an error: ' + error + '</td>';
            table.appendChild(tr);
        });
    }
}

document.getElementById('tryit').addEventListener('click', mc.tryit);
