'use strict';
async function runProgramSmoke({stage,capture}){
  await stage('edition 11 actual programming assessment in four languages',`
    ensure(ELDI_PROGRAM_ASSESSMENTS.length===55,'Nedostaje 55 programerskih izazova.');
    go('assessment');ELDIProgramAssessment.selectTask('pa-zbir');
    const languages={
      python:'a,b=map(int,input().split())\\nprint(a+b)\\n',
      c:'#include <stdio.h>\\nint main(void){long long a,b;if(scanf("%lld%lld",&a,&b)!=2)return 1;printf("%lld\\\\n",a+b);return 0;}\\n',
      cpp:'#include <iostream>\\nint main(){long long a,b;std::cin>>a>>b;std::cout<<a+b<<"\\\\n";}\\n',
      java:'import java.util.Scanner;\\npublic class Main{public static void main(String[]args){Scanner s=new Scanner(System.in);long a=s.nextLong(),b=s.nextLong();System.out.println(a+b);}}\\n'
    };
    for(const [language,code]of Object.entries(languages)){
      $('pa-language').value=language;$('pa-language').dispatchEvent(new Event('change',{bubbles:true}));fill($('pa-code'),code);await ELDIProgramAssessment.run();
      const result=state().programAssessment.attempts.at(-1);
      ensure(result?.language===language&&result.passed===8&&result.total===8&&result.grade===5,'Stvarni program nije prošao 8 testova: '+language+' '+$('pa-status').textContent);
      ensure($('pa-result').textContent.includes('Skriveni'),'Rezultat nije prikazao skrivene testove.');
    }
    const before=state().programAssessment.attempts.length;
    $('pa-language').value='python';$('pa-language').dispatchEvent(new Event('change',{bubbles:true}));fill($('pa-code'),'a,b=map(int,input().split())\\nprint(a-b)\\n');await ELDIProgramAssessment.run();
    const incorrect=state().programAssessment.attempts.at(-1);ensure(incorrect.passed<8&&incorrect.grade<5,'Pogrešan program dobio je ocjenu 5.');
    ensure(state().programAssessment.attempts.length===before+1,'Pokušaji programiranja nisu sačuvani.');
    const solution=await eldiDesktop.programSolution({taskId:'pa-zbir',language:'python'});fill($('pa-code'),solution.code);await ELDIProgramAssessment.run();
    ensure(state().programAssessment.attempts.at(-1).passed===8,'Riješen primjer nije prošao stvarne testove.');
    const native=await eldiDesktop.gradeProgram({taskId:'pa-zbir',language:'python',code:solution.code});
    for(const row of native.tests.filter(test=>!test.public))for(const secret of ['input','expected','actual','error','stdout','stderr'])ensure(!Object.hasOwn(row,secret),'Skriveni test otkriva '+secret);
    const badge=ELDIAwards.badgeProgress(state()).find(item=>item.id==='programming-1');ensure(badge?.earned,'Uspješno programiranje nije dodalo značku.');
    const exported=ELDIProfiles.exportProfile(state());ensure(exported.profile.programAssessment.attempts.length>=6,'Programerski rad nije sačuvan u profilu.');
    await ELDIStorage.flush();
  `);
  await capture('18-programming-assessment');
  await stage('edition 11 global search and accessible text size',`
    $('global-search').click();fill($('global-search-input'),'razlom');ensure(document.querySelectorAll('.search-result').length>0,'Globalna pretraga nije pronašla razlomke.');
    $('global-search-close').click();ensure(!$('global-search-dialog'),'Pretraga nije zatvorena.');
    $('text-large').click();ensure(document.body.dataset.textSize==='large','Veći tekst nije uključen.');$('text-normal').click();
    go('maintenance');ensure($('backup-now')&&$('update-check'),'Čuvanje i provjera izdanja nisu dostupni.');
    ensure((window.__eldiErrors||[]).length===0,'Greške novih stranica: '+JSON.stringify(window.__eldiErrors));
    go('home');
  `);
}
module.exports={runProgramSmoke};
