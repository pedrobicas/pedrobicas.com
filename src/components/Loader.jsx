export default function Loader() {
  return (
    <div className="loader" aria-hidden="true" data-cursor="pular">
      <div className="loader-half loader-top">
        <div className="loader-term">
          <p className="lt-cmd">pedro@bicas:~$ <span>./iniciar --portfolio</span></p>
          <p className="lt">aquecendo o café<span className="lt-dots"></span><span className="ok">ok</span></p>
          <p className="lt">compilando ideias<span className="lt-dots"></span><span className="ok">ok</span></p>
          <p className="lt">subindo o servidor<span className="lt-dots"></span><span className="ok">ok</span></p>
        </div>
      </div>
      <div className="loader-half loader-bot">
        <p className="loader-count">000</p>
        <p className="loader-skip">clique para pular</p>
      </div>
      <div className="loader-line"></div>
    </div>
  );
}
