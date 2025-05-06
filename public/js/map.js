
    let maptoken=mapToken;
    console.log(maptoken);
	mapboxgl.accessToken = maptoken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/light-v11',
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.cursor = 'pointer';
    
    // Create the default icon and logo icon
    const defaultIcon = document.createElement('img');
    defaultIcon.src = 'https://img.freepik.com/free-vector/location_53876-25530.jpg?t=st=1745935432~exp=1745939032~hmac=1a673212bc548867ab55ffc987cbd2ebc0a9f8099a367f1b94d0d45d5e5be891&w=1380';
    defaultIcon.style.width = '100%';
    defaultIcon.style.height = '100%';
    defaultIcon.style.transition = 'opacity 0.2s ease';
    
    const logoIcon = document.createElement('img');
    logoIcon.src = 'https://img.freepik.com/free-vector/blue-real-state-logo_1025-19.jpg?t=st=1745936284~exp=1745939884~hmac=f3736b7563fb6223b143cce436cce9652c3ddda41cea04825b4539abd1794d2c&w=1380'; // Or PNG if no SVG
    logoIcon.style.width = '100%';
    logoIcon.style.height = '100%';
    logoIcon.style.position = 'absolute';
    logoIcon.style.top = '0';
    logoIcon.style.left = '0';
    logoIcon.style.opacity = '0'; // Hidden initially
    logoIcon.style.transition = 'opacity 0.2s ease';
    
    // Append both to marker element
    el.appendChild(defaultIcon);
    el.appendChild(logoIcon);
    
    // Hover effect to toggle logos
    el.addEventListener('mouseenter', () => {
      defaultIcon.style.opacity = '0';
      logoIcon.style.opacity = '1';
    });
    
    el.addEventListener('mouseleave', () => {
      defaultIcon.style.opacity = '1';
      logoIcon.style.opacity = '0';
    });
    
    // Add to Mapbox
    new mapboxgl.Marker(el)
      .setLngLat(listing.geometry.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact location provided after booking</p>`)
      )
      .addTo(map);
    