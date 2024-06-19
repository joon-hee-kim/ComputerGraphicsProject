# ComputerGraphicsStudy
About  Computer Graphics lecture&amp;Graphics study

**If you want to see our Term Project website, please enter TermProject file -> Map -> MainPage.html**
<br/>

### **Demo GIF**
![graphicsTermProject](https://github.com/Pyeonseohee/ComputerGraphicsStudy/assets/58354506/cafdb242-283e-4a56-8fe1-820fd383cbbc)

<br/>

## **Mini Metro TermProject**
Gachon University 2023 Computer Graphics Term Project: Clone **Mini Metro Game** for WebGL with 2D&3D.

### Summary
We have added camera movements, mesh movements, light source processing, etc. to implement mini-metro games in 3D for graphics lecture purposes rather than game strategies.

[Mini Metro Game] is metro strategy simulation game with 2D.

![image](https://github.com/Pyeonseohee/ComputerGraphicsStudy/assets/58354506/5e5232e4-2f2e-4119-8cee-5dea4f408096)

Reference: https://ko.wikipedia.org/wiki/%EB%AF%B8%EB%8B%88_%EB%A9%94%ED%8A%B8%EB%A1%9C

### Developmet Environment
We development with vanilla javascript with Three.js library.

### About InGame Feature
1. First user enter our webPage, user can choose own's character.
2. If user choose it and click start button, user can move their character using key input(w, a, s, d, shift).
3. The sun and skybox move with time, the metro move their default route map and NPC are randomly generated and moved to subway stations.
4. The sun is set, street lights are light up.
5. Also user can create a new metro route map by connecting subway stations.


![image](https://github.com/Pyeonseohee/ComputerGraphicsStudy/assets/58354506/31e24495-b20b-4ba1-a688-4129cb5758f1)
<br/>

### About Game Logic
1. Character animate
   
We implemented character animation through **animation systam(clip, mixer,action etc) provided by three.js**.

Reference: https://threejs.org/docs/#api/en/animation/AnimationMixer

2. NPCs move from start point to arrival point
   
NPCs are created in start building in randomly building list, and move nearest station.

And we implemented NPC's route map using **Dijkstra's algorithm**.

3. The sun and skybox move with time
We used the sin and cos functions to circle the light to implement day and night.

And not only light, but also skybox changes to express it realistically.
This part utilized the open source shown in the webGL sample.

Reference: https://threejs.org/examples/webgl_shaders_sky.html

### 👥 Team Member
Kim Jooho </br>
Kim Joonhee </br>
Hwang Heeseong </br>
Lee Yungyo </br>
Pyeon Seohee </br>
